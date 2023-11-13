import { lookupArchive } from "@subsquid/archive-registry";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import { MultisigRepository } from "./repository/MultisigRepository";
import { TransactionRepository } from "./repository/TransactionRepository";
import { ApprovalRepository } from "./repository/ApprovalRepository";
import { RejectionRepository } from "./repository/RejectionRepository";
import { ExternalTransactionDataRepository } from "./repository/ExternalTransactionDataRepository";
import { TransferRepository } from "./repository/TransferRepository";
import {
  existingMultisigs,
  multisigData,
  transactionData,
  approvals,
  rejections,
  transferRecords,
} from "./common/entityRecords";
import { MultisigFactoryEventHandler } from "./mappings/MultisigFactoryEventHandler";
import { MultisigEventHandler } from "./mappings/MultisigEventHandler";
import { FACTORY_ADDRESS, FACTORY_DEPLOYMENT_BLOCK, PSP22_TRANSFER_FROM_SELECTOR, PSP22_TRANSFER_SELECTOR } from "./common/constants";
import { TransferHandler } from "./mappings/TransferHandler";

// Define the processor
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "FireSquid" }),
  })
  .setBlockRange({
    from: FACTORY_DEPLOYMENT_BLOCK,
  })
  .addEvent("Balances.Transfer", {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true,
        },
      },
    },
  } as const)
  .addContractsContractEmitted("*");

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

// Run the processor
processor.run(new TypeormDatabase(), async (ctx) => {
  // Initialize repositories
  const multisigRepository = new MultisigRepository(ctx);
  const externalTransactionDataRepository =
    new ExternalTransactionDataRepository(ctx);
  const transactionRepository = new TransactionRepository(
    ctx,
    multisigRepository,
    externalTransactionDataRepository
  );
  const approvalRepository = new ApprovalRepository(ctx, transactionRepository);
  const rejectionRepository = new RejectionRepository(
    ctx,
    transactionRepository
  );
  const transferRepository = new TransferRepository(ctx, multisigRepository);

  // Initialize handlers
  const multisigFactoryEventHandler = new MultisigFactoryEventHandler();
  const multisigEventHandler = new MultisigEventHandler(
    multisigRepository,
    transactionRepository,
    externalTransactionDataRepository
  );
  const transferHandler = new TransferHandler();

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
        const messageSelector = item.event.call.args.data.slice(0, 10);
        
        // Factory Events
        if (contractAddressHex === FACTORY_ADDRESS) {
          //console.dir(item, { depth: null })
          //console.log("message selector: ", messageSelector)
          multisigFactoryEventHandler.handleEvent(
            item.event.args.data,
            block.header
          );
        }
        // Multisigs Events
        else if (existingMultisigs.has(contractAddressHex)) {
          await multisigEventHandler.handleEvent(
            contractAddressHex,
            item.event.args.data,
            item.event.extrinsic.hash,
            block.header
          );
        }
        // PSP22 Transfers
        else if (messageSelector === PSP22_TRANSFER_SELECTOR || messageSelector === PSP22_TRANSFER_FROM_SELECTOR) {
            
          transferHandler.handlePSP22Transfer(
              contractAddressHex,
              item.event.call.args.data,
              item.event.extrinsic.hash,
              block.header
            );
        }
        else {
          // console.log("--------------------")
          // console.log("message selector: ")
          // console.log(messageSelector)
          // console.log("transfer selector: ")
          // console.log(PSP22_TRANSFER_SELECTOR)
          // console.log("transfer from selector: ")
          // console.log(PSP22_TRANSFER_FROM_SELECTOR)
        }
      } 
      // Native Transfers
      else if (item.name === "Balances.Transfer") {
        const { from, to } = item.event.args;

        if (existingMultisigs.has(from) || existingMultisigs.has(to)) {
          const multisigAddress = existingMultisigs.has(from) ? from : to;

          transferHandler.handleNativeTransfer(
            item.event.args,
            multisigAddress,
            item.event.extrinsic!.hash,
            block.header
          );
        }
      }
    }
  }

  // Save the data in the DB
  await multisigRepository.updateOrCreate(Object.values(multisigData));
  await transactionRepository.updateOrCreate(Object.values(transactionData));
  await approvalRepository.create(approvals);
  await rejectionRepository.create(rejections);
  await transferRepository.create(transferRecords);
});
