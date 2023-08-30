import { lookupArchive } from "@subsquid/archive-registry";
import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { In } from "typeorm";
import * as multisig_factory from "./abi/multisig_factory";
import * as multisig from "./abi/multisig";
import {
  Multisig,
  MultisigFactory,
  Transaction,
  TransactionStatus,
  Approval,
  Rejection,
} from "./model";
import { assertNotNull } from "@subsquid/substrate-processor";
import {
  MultisigError_EnvExecutionFailed,
  MultisigError_LangExecutionFailed,
} from "./abi/multisig";

import { MultisigRepository } from "./repository/MultisigRepository";
import {
  uint8ArrayToHexString,
  toEntityMap,
  toEntityMapTx,
} from "./common/helpers";
import { TransactionRepository } from "./repository/TransactionRepository";
import {
  ApprovalOrRejectionRecord,
  MultisigRecord,
  TransactionRecord,
} from "./common/types";
import { ApprovalRepository } from "./repository/ApprovalRepository";
import { RejectionRepository } from "./repository/RejectionRepository";

const FACTORY_ADDRESS_SS58 = "bgzZgSNXh2wqApuFbP1pzs9MBWJUcGdzRbFSkZp3J4SPWgq";
const FACTORY_ADDRESS = toHex(ss58.decode(FACTORY_ADDRESS_SS58).bytes);
const SS58_PREFIX = ss58.decode(FACTORY_ADDRESS_SS58).prefix;

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "FireSquid" }),
  })
  .setBlockRange({
    from: 4438254,
  })
  .addContractsContractEmitted("*");

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

let existingMultisigs: Map<string, boolean>; //Map that contains the multisig address and a boolean that indicates if we have the content on multisigData
const multisigData: Record<string, MultisigRecord> = {};

let existingTransactions: Set<string>;
const transactionData: Record<string, TransactionRecord> = {};

const approvals: ApprovalOrRejectionRecord[] = [];
const rejections: ApprovalOrRejectionRecord[] = [];

processor.run(new TypeormDatabase(), async (ctx) => {
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

  if (!existingMultisigs) {
    existingMultisigs = await multisigRepository
      .findAll()
      .then((m) => new Map(m.map((m) => [m.addressHex, false])));
  }

  existingTransactions = new Set();

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Contracts.ContractEmitted") {
        const contractAddressHex = item.event.args.contract;
        // Factory Events
        if (contractAddressHex === FACTORY_ADDRESS) {
          const event = multisig_factory.decodeEvent(item.event.args.data);
          if (event.__kind === "NewMultisig") {
            const multisigAddress = ss58
              .codec(SS58_PREFIX)
              .encode(event.multisigAddress);
            const multisigAddressHex = uint8ArrayToHexString(
              event.multisigAddress
            );

            // Add to map
            existingMultisigs.set(multisigAddressHex, true);

            // Add to object
            multisigData[multisigAddressHex] = {
              id: item.event.id,
              addressSS58: multisigAddress,
              addressHex: multisigAddressHex,
              deploymentSalt: uint8ArrayToHexString(event.salt),
              threshold: event.threshold,
              owners: event.ownersList.map((owner) =>
                ss58.codec(SS58_PREFIX).encode(owner)
              ),
              creationTimestamp: new Date(block.header.timestamp),
              creationBlockNumber: block.header.height,
            };
          }
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

  await multisigRepository.updateOrCreate(Object.values(multisigData));
  await transactionRepository.updateOrCreate(Object.values(transactionData));
  await approvalRepository.create(approvals);
  await rejectionRepository.create(rejections);
});