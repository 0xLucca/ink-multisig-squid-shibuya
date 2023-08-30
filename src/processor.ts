import { lookupArchive } from "@subsquid/archive-registry";
import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import * as multisig from "./abi/multisig";
import { TransactionStatus } from "./model";
import {
  MultisigError_EnvExecutionFailed,
  MultisigError_LangExecutionFailed,
} from "./abi/multisig";

import { MultisigRepository } from "./repository/MultisigRepository";
import { uint8ArrayToHexString } from "./common/helpers";
import { TransactionRepository } from "./repository/TransactionRepository";
import {
  ApprovalOrRejectionRecord,
} from "./common/types";
import { ApprovalRepository } from "./repository/ApprovalRepository";
import { RejectionRepository } from "./repository/RejectionRepository";
import {
  existingMultisigs,
  multisigData,
  existingTransactions,
  transactionData,
  approvals,
  rejections,
} from "./common/entityRecords";
import { handleMultisigFactoryEvents } from "./mappings/multisigFactory";
import { FACTORY_ADDRESS, FACTORY_DEPLOYMENT_BLOCK, SS58_PREFIX } from "./common/constants";

// Define the processor
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "FireSquid" }),
  })
  .setBlockRange({
    from: FACTORY_DEPLOYMENT_BLOCK,
  })
  .addContractsContractEmitted("*");

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

// Run the processor
processor.run(new TypeormDatabase(), async (ctx) => {
  // Initialize repositories
  const multisigRepository = new MultisigRepository(ctx);
  const transactionRepository = new TransactionRepository(
    ctx,
    multisigRepository
  );
  const approvalRepository = new ApprovalRepository(ctx, transactionRepository);
  const rejectionRepository = new RejectionRepository(
    ctx,
    transactionRepository
  );

  // Initialize existingMultisigs in order to know if the event received is related to a multisig
  if (existingMultisigs.size === 0) {
    await multisigRepository.findAll().then((multisigs) => {
      for (let multisig of multisigs) {
        existingMultisigs.set(multisig.addressHex, false);
      }
    });
  }

  // Main loop to process the data
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Contracts.ContractEmitted") {
        const contractAddressHex = item.event.args.contract;
        // Factory Events
        if (contractAddressHex === FACTORY_ADDRESS) {
          handleMultisigFactoryEvents(item.event.args.data, block.header);
        }
        // Multisigs Events
        if (existingMultisigs.has(contractAddressHex)) {
          const event = multisig.decodeEvent(item.event.args.data);
          if (event.__kind === "ThresholdChanged") {
            // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
            if (!existingMultisigs.get(contractAddressHex)) {
              multisigData[contractAddressHex] = (
                await multisigRepository.findByAddressHex([contractAddressHex])
              )[0]; //This must exist and be unique

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddressHex, true);
            }

            // Update the threshold
            multisigData[contractAddressHex].threshold = event.threshold;
          }
          if (event.__kind === "OwnerAdded") {
            // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
            if (existingMultisigs.get(contractAddressHex) === false) {
              multisigData[contractAddressHex] = (
                await multisigRepository.findByAddressHex([contractAddressHex])
              )[0]; //This must exist and be unique

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddressHex, true);
            }

            // Add the new owner
            multisigData[contractAddressHex].owners.push(
              ss58.codec(SS58_PREFIX).encode(event.owner)
            );
          }
          if (event.__kind === "OwnerRemoved") {
            // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
            if (existingMultisigs.get(contractAddressHex) === false) {
              multisigData[contractAddressHex] = (
                await multisigRepository.findByAddressHex([contractAddressHex])
              )[0]; //This must exist and be unique

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddressHex, true);
            }
            // Remove the owner
            multisigData[contractAddressHex].owners = multisigData[
              contractAddressHex
            ].owners.filter(
              (owner) => owner !== ss58.codec(SS58_PREFIX).encode(event.owner)
            );
          }

          if (event.__kind === "TransactionProposed") {
            //Each time a transaction is proposed, we create a new transaction record and also a new approval record for the creator
            const newTransactionId = contractAddressHex + "-" + event.txId;
            existingTransactions.add(newTransactionId);
            transactionData[newTransactionId] = {
              id: newTransactionId,
              multisig: contractAddressHex,
              txId: event.txId,
              proposer: ss58.codec(SS58_PREFIX).encode(event.proposer),
              contractAddress: ss58
                .codec(SS58_PREFIX)
                .encode(event.contractAddress),
              selector: uint8ArrayToHexString(event.selector),
              args: uint8ArrayToHexString(event.input),
              value: event.transferredValue,
              status: TransactionStatus.PROPOSED,
              error: "",
              approvalCount: 1,
              rejectionCount: 0,
              lastUpdatedTimestamp: new Date(block.header.timestamp),
              lastUpdatedBlockNumber: block.header.height,
            };

            const newApprovalId =
              newTransactionId + "-" + uint8ArrayToHexString(event.proposer);

            // Add the approval
            const newApproval: ApprovalOrRejectionRecord = {
              id: newApprovalId,
              transaction: newTransactionId,
              caller: ss58.codec(SS58_PREFIX).encode(event.proposer),
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
            };

            approvals.push(newApproval);
          }
          if (event.__kind === "TransactionExecuted") {
            const transactionId = contractAddressHex + "-" + event.txId;
            if (!existingTransactions.has(transactionId)) {
              let dbTx = (
                await transactionRepository.findById([transactionId])
              )[0]; //This must exist and be unique
              transactionData[transactionId] = {
                id: transactionId,
                multisig: contractAddressHex,
                txId: event.txId,
                proposer: dbTx.proposer,
                contractAddress: dbTx.contractAddress,
                selector: dbTx.selector,
                args: dbTx.args,
                value: dbTx.value,
                status: dbTx.status,
                error: dbTx.error,
                approvalCount: dbTx.approvalCount,
                rejectionCount: dbTx.rejectionCount,
                lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
                lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
              };

              existingTransactions.add(transactionId);
            }

            // Update the transaction
            transactionData[transactionId].lastUpdatedTimestamp = new Date(
              block.header.timestamp
            );
            transactionData[transactionId].lastUpdatedBlockNumber =
              block.header.height;

            if (event.result.__kind === "Success") {
              transactionData[transactionId].status =
                TransactionStatus.EXECUTED_SUCCESS;
            }
            if (event.result.__kind === "Failed") {
              transactionData[transactionId].status =
                TransactionStatus.EXECUTED_FAILURE;

              if (event.result.value.__kind === "EnvExecutionFailed") {
                let error = event.result
                  .value as MultisigError_EnvExecutionFailed;
                transactionData[transactionId].error =
                  event.result.value.__kind + ": " + error.value;
              } else if (event.result.value.__kind === "LangExecutionFailed") {
                let error = event.result
                  .value as MultisigError_LangExecutionFailed;
                transactionData[transactionId].error =
                  event.result.value.__kind + ": " + error.value.__kind;
              } else {
                transactionData[transactionId].error =
                  event.result.value.__kind;
              }
            }
          }
          if (event.__kind === "TransactionCancelled") {
            const transactionId = contractAddressHex + "-" + event.txId;
            if (!existingTransactions.has(transactionId)) {
              let dbTx = (
                await transactionRepository.findById([transactionId])
              )[0]; //This must exist and be unique
              transactionData[transactionId] = {
                id: transactionId,
                multisig: contractAddressHex,
                txId: event.txId,
                proposer: dbTx.proposer,
                contractAddress: dbTx.contractAddress,
                selector: dbTx.selector,
                args: dbTx.args,
                value: dbTx.value,
                status: dbTx.status,
                error: dbTx.error,
                approvalCount: dbTx.approvalCount,
                rejectionCount: dbTx.rejectionCount,
                lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
                lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
              };

              existingTransactions.add(transactionId);
            }

            // Update the transaction
            transactionData[transactionId].lastUpdatedTimestamp = new Date(
              block.header.timestamp
            );
            transactionData[transactionId].lastUpdatedBlockNumber =
              block.header.height;
            transactionData[transactionId].status = TransactionStatus.CANCELLED;
          }
          if (event.__kind === "TransactionRemoved") {
          }
          if (event.__kind === "Approve") {
            const transactionId = contractAddressHex + "-" + event.txId;
            const newApprovalId =
              transactionId + "-" + uint8ArrayToHexString(event.owner);
            // Check if the tx is on memory. If not, fetch it from the DB
            if (!existingTransactions.has(transactionId)) {
              let dbTx = (
                await transactionRepository.findById([transactionId])
              )[0]; //This must exist and be unique
              transactionData[transactionId] = {
                id: transactionId,
                multisig: contractAddressHex,
                txId: dbTx.txId,
                proposer: dbTx.proposer,
                contractAddress: dbTx.contractAddress,
                selector: dbTx.selector,
                args: dbTx.args,
                value: dbTx.value,
                status: dbTx.status,
                error: dbTx.error,
                approvalCount: dbTx.approvalCount,
                rejectionCount: dbTx.rejectionCount,
                lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
                lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
              };

              existingTransactions.add(transactionId);
            }

            // Update the transaction
            transactionData[transactionId].approvalCount += 1;

            // Add the approval
            const newApproval: ApprovalOrRejectionRecord = {
              id: newApprovalId,
              transaction: transactionId,
              caller: ss58.codec(SS58_PREFIX).encode(event.owner),
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
            };

            approvals.push(newApproval);
          }
          if (event.__kind === "Reject") {
            const transactionId = contractAddressHex + "-" + event.txId;
            const newRejectionId =
              transactionId + "-" + uint8ArrayToHexString(event.owner);
            // Check if the tx is on memory. If not, fetch it from the DB
            if (!existingTransactions.has(transactionId)) {
              let dbTx = (
                await transactionRepository.findById([transactionId])
              )[0]; //This must exist and be unique
              transactionData[transactionId] = {
                id: transactionId,
                multisig: contractAddressHex,
                txId: dbTx.txId,
                proposer: dbTx.proposer,
                contractAddress: dbTx.contractAddress,
                selector: dbTx.selector,
                args: dbTx.args,
                value: dbTx.value,
                status: dbTx.status,
                error: dbTx.error,
                approvalCount: dbTx.approvalCount,
                rejectionCount: dbTx.rejectionCount,
                lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
                lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
              };

              existingTransactions.add(transactionId);
            }

            // Update the transaction
            transactionData[transactionId].rejectionCount += 1;

            // Add the approval
            const newRejection: ApprovalOrRejectionRecord = {
              id: newRejectionId,
              transaction: transactionId,
              caller: ss58.codec(SS58_PREFIX).encode(event.owner),
              timestamp: new Date(block.header.timestamp),
              blockNumber: block.header.height,
            };

            rejections.push(newRejection);
          }
          if (event.__kind === "Transfer") {
          }
        }
      }
    }
  }

  // Save the data in the DB
  await multisigRepository.updateOrCreate(Object.values(multisigData));
  await transactionRepository.updateOrCreate(Object.values(transactionData));
  await approvalRepository.create(approvals);
  await rejectionRepository.create(rejections);

  // TODO: Clean the data from memory
});

