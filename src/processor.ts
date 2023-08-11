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
import { Multisig, MultisigFactory } from "./model";

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
  multisigId: string;
  createdBy: string;
  creationTimestamp: Date;
  creationBlockNumber: number;
  status: string;
  method: string;
  args: string;
}

let existingMultisigs: Set<string>;

processor.run(new TypeormDatabase(), async (ctx) => {

  if (!existingMultisigs) {
    existingMultisigs = await ctx.store
      .findBy(Multisig, {})
      .then((m) => new Set(m.map((i) => i.id)));
  }

  let multisigRecords: MultisigRecord[] = [];
  let transactions: TransactionRecord[] = [];

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Contracts.ContractEmitted") {
        const contractAddress = item.event.args.contract;
        // Factory Events
        if (contractAddress === FACTORY_ADDRESS) {
          const event = multisig_factory.decodeEvent(item.event.args.data);
          if (event.__kind === "NewMultisig") {
            //GetOrCreate MultisigFactory

            multisigRecords.push({
              id: item.event.id,
              address: ss58.codec(SS58_PREFIX).encode(event.multisigAddress),
              threshold: event.threshold,
              owners: event.ownersList.map((owner) =>
                ss58.codec(SS58_PREFIX).encode(owner)
              ),
              creationTimestamp: new Date(block.header.timestamp),
              creationBlockNumber: block.header.height,
            });
          }
        }
        // Multisigs Events
        if (existingMultisigs.has(contractAddress)) {
          const event = multisig.decodeEvent(item.event.args.data);
          if (event.__kind === "ThresholdChanged") {
          }
          if (event.__kind === "OwnerAdded") {
          }
          if (event.__kind === "OwnerRemoved") {
          }
          if (event.__kind === "TransactionProposed") {
            //Each time a transaction is proposed, we create a new transaction record and also a new approval record for the creator
          }
          if (event.__kind === "TransactionExecuted") {
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

  await createMultisigs(ctx, multisigRecords);
});

async function createMultisigs(ctx: Ctx, multisigRecords: MultisigRecord[]) {
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

    existingMultisigs.add(ms.id);

    return multisig;
  });

  await ctx.store.insert(multisigs);
}
