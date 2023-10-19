import { SubstrateBlock } from "@subsquid/substrate-processor";
import { TransferType } from "../model";
import { TransferRecord } from "../common/types";
import { transferRecords } from "../common/entityRecords";

export class TransferHandler {
  constructor() {}

  handleNativeTransfer(
    args: any,
    multisigAddress: string,
    txHash: string,
    blockHeader: SubstrateBlock
  ) {
    const transfer = {
      id: txHash,
      multisig: multisigAddress,
      from: args.from,
      to: args.to,
      value: BigInt(args.amount),
      transferType: TransferType.NATIVE,
      creationTimestamp: new Date(blockHeader.timestamp),
      creationBlockNumber: blockHeader.height,
    } as TransferRecord;

    transferRecords.push(transfer);
  }
}
