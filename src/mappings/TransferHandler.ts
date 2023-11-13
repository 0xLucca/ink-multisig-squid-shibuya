import { SubstrateBlock } from "@subsquid/substrate-processor";
import { TransferType } from "../model";
import { TransferRecord } from "../common/types";
import { transferRecords } from "../common/entityRecords";
import { SS58_PREFIX } from "../common/constants";
import * as ss58 from "@subsquid/ss58";
import { hexStringToUint8Array} from "../common/helpers";
import * as psp22 from "../abi/psp22";
import { existingMultisigs } from "../common/entityRecords";

export class TransferHandler {
  constructor() {}

  handleNativeTransfer(
    args: any,
    multisigAddress: string,
    txHash: string,
    blockHeader: SubstrateBlock
  ) {
    let from = hexStringToUint8Array(args.from);
    let to = hexStringToUint8Array(args.to);

    const transfer = {
      id: txHash,
      multisig: multisigAddress,
      from: ss58.codec(SS58_PREFIX).encode(from),
      to: ss58.codec(SS58_PREFIX).encode(to),
      value: BigInt(args.amount),
      transferType: TransferType.NATIVE,
      creationTimestamp: new Date(blockHeader.timestamp),
      creationBlockNumber: blockHeader.height,
    } as TransferRecord;

    transferRecords.push(transfer);
  }

  handlePSP22Transfer(
    tokenAddressHex: string,
    callData: string,
    txHash: string,
    blockHeader: SubstrateBlock
  ){
    // const event = psp22.decodeEvent(evenData);
    const message = psp22.decodeMessage(callData);
    console.log(message);
    // switch (event.__kind) {
    //   case "ThresholdChanged":

    // let from = hexStringToUint8Array(args.from);
    // let to = hexStringToUint8Array(args.to);

    // const transfer = {
    //   id: txHash,
    //   multisig: multisigAddress,
    //   from: ss58.codec(SS58_PREFIX).encode(from),
    //   to: ss58.codec(SS58_PREFIX).encode(to),
    //   value: BigInt(args.amount),
    //   transferType: TransferType.NATIVE,
    //   creationTimestamp: new Date(blockHeader.timestamp),
    //   creationBlockNumber: blockHeader.height,
    // } as TransferRecord;

    // transferRecords.push(transfer);
  }
}
