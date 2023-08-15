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
import { Multisig, MultisigFactory, Transaction, TransactionStatus } from "./model";
import {assertNotNull} from '@subsquid/substrate-processor';

function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return (
    "0x" +
    Array.from(uint8Array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    )
  );
}

const FACTORY_ADDRESS_SS58 = "XYmu1eoskyj83bSWqhTW2DUzuRCHHgrFGXUv3yxhBVBd3tT";
const FACTORY_ADDRESS = toHex(ss58.decode(FACTORY_ADDRESS_SS58).bytes);
const SS58_PREFIX = ss58.decode(FACTORY_ADDRESS_SS58).prefix;

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "FireSquid" }),
  })
  .setBlockRange({
    from: 4390511,
  })
  .addContractsContractEmitted("*");

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

interface MultisigRecord {
  id: string;
  address: string;
  threshold: number;
  owners: string[];
  creationTimestamp: Date;
  creationBlockNumber: number;
}

interface TransactionRecord {
  id: string;
  multisig: string;
  txId: bigint;
  contractAddress: string;
  selector: string;
  args: string;
  value: bigint;
  status: TransactionStatus;
  error: string;
  approvalCount: number;
  rejectionCount: number;
  lastUpdatedTimestamp: Date;
  lastUpdatedBlockNumber: number;
}

//let existingMultisigs: Set<string>;
let existingMultisigs: Map<string, boolean>; //Map that contains the multisig address and a boolean that indicates if we have the content on multisigData
const multisigData: { [key: string]: MultisigRecord } = {};

let existingTransactions: Set<string>;
const transactionData: { [key: string]: TransactionRecord } = {};

processor.run(new TypeormDatabase(), async (ctx) => {
  if (!existingMultisigs) {
    existingMultisigs = await ctx.store
      .findBy(Multisig, {})
      .then((m) => new Map(m.map((m) => [m.id, false])));
  }

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Contracts.ContractEmitted") {
        const contractAddress = item.event.args.contract;
        // Factory Events
        if (contractAddress === FACTORY_ADDRESS) {
          const event = multisig_factory.decodeEvent(item.event.args.data);
          if (event.__kind === "NewMultisig") {
            const multisigAddress = ss58
              .codec(SS58_PREFIX)
              .encode(event.multisigAddress);

            // Add to map
            existingMultisigs.set(multisigAddress, true);

            // Add to object
            multisigData[multisigAddress] = {
              id: item.event.id,
              address: multisigAddress,
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
        if (existingMultisigs.has(contractAddress)) {
          const event = multisig.decodeEvent(item.event.args.data);
          if (event.__kind === "ThresholdChanged") {
            // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
            if (!existingMultisigs.get(contractAddress)) {
              multisigData[contractAddress] = (
                await ctx.store.findBy(Multisig, { id: In([contractAddress]) })
              )[0]; //This must exist and be unique

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddress, true);
            }

            // Update the threshold
            multisigData[contractAddress].threshold = event.threshold;
          }
          if (event.__kind === "OwnerAdded") {
            // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
            if (existingMultisigs.get(contractAddress) === false) {
              multisigData[contractAddress] = (
                await ctx.store.findBy(Multisig, { id: In([contractAddress]) })
              )[0]; //This must exist and be unique

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddress, true);
            }

            // Add the new owner
            multisigData[contractAddress].owners.push(
              ss58.codec(SS58_PREFIX).encode(event.owner)
            );
          }
          if (event.__kind === "OwnerRemoved") {
            // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
            if (existingMultisigs.get(contractAddress) === false) {
              multisigData[contractAddress] = (
                await ctx.store.findBy(Multisig, { id: In([contractAddress]) })
              )[0]; //This must exist and be unique

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddress, true);
            }

            // Remove the owner
            multisigData[contractAddress].owners = multisigData[
              contractAddress
            ].owners.filter(
              (owner) => owner !== ss58.codec(SS58_PREFIX).encode(event.owner)
            );
          }
          if (event.__kind === "TransactionProposed") {
            //Each time a transaction is proposed, we create a new transaction record and also a new approval record for the creator
            const newTransactionId = contractAddress + "-" + event.txId;
            existingTransactions.add(newTransactionId);
            transactionData[newTransactionId] = {
              id: newTransactionId,
              multisig: contractAddress,
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
          }
          if (event.__kind === "TransactionExecuted") {
            const transactionId = contractAddress + "-" + event.txId;
            if (!existingTransactions.has(transactionId)) {
              let dbTx = (
                await ctx.store.findBy(Transaction, { id: In([transactionId]) })
              )[0]; //This must exist and be unique
              transactionData[transactionId] = {
                id: transactionId,
                multisig: contractAddress,
                txId: event.txId,
                contractAddress: dbTx.contractAddress,
                selector: dbTx.selector,
                args: dbTx.args,
                value: dbTx.value,
                status: TransactionStatus.EXECUTED_SUCCESS, //TODO HANDLE SUCCESS AND FAILURE
                error: "", //TODO: Get error from event
                approvalCount: dbTx.approvalCount,
                rejectionCount: dbTx.rejectionCount,
                lastUpdatedTimestamp: new Date(block.header.timestamp),
                lastUpdatedBlockNumber: block.header.height,
              };

              // Set map to true to indicate that we have the content on multisigData
              existingMultisigs.set(contractAddress, true);
            }
          }
          if (event.__kind === "TransactionRemoved") {
          }
          if (event.__kind === "Approve") {
          }
          if (event.__kind === "Reject") {
          }
          if (event.__kind === "Transfer") {
          }
        }
      }
    }
  }

  await updateOrCreateMultisigs(ctx, Object.values(multisigData));
  await updateOrCreateTransactions(ctx, Object.values(transactionData));
});

async function updateOrCreateMultisigs(
  ctx: Ctx,
  multisigRecords: MultisigRecord[]
) {
  let multisigs: Multisig[] = [];

  multisigs = multisigRecords.map((ms) => {
    const multisig = new Multisig({
      id: ms.id,
      address: ms.address,
      threshold: ms.threshold,
      owners: ms.owners,
      creationTimestamp: ms.creationTimestamp,
      creationBlockNumber: ms.creationBlockNumber,
    });

    return multisig;
  });

  await ctx.store.save(multisigs);
}

async function updateOrCreateTransactions(
  ctx: Ctx,
  transactions: TransactionRecord[]
) {
  let txs: Transaction[] = [];

  txs = transactions.map((tx) => {
    const transaction = new Transaction({
      id: tx.id,
      multisig: tx.multisig,
      txId: Number(tx.txId),
      contractAddress: tx.contractAddress,
      selector: tx.selector,
      args: tx.args,
      value: tx.value,
      status: tx.status,
      error: tx.error,
      approvalCount: tx.approvalCount,
      rejectionCount: tx.rejectionCount,
      lastUpdatedTimestamp: tx.lastUpdatedTimestamp,
      lastUpdatedBlockNumber: tx.lastUpdatedBlockNumber,
    });

    return transaction;
  });

  await ctx.store.save(txs);
}
