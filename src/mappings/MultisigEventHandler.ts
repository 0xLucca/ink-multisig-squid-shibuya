import {
  approvals,
  existingMultisigs,
  existingTransactions,
  multisigData,
  rejections,
  transactionData,
} from "../common/entityRecords";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import * as multisig from "../abi/multisig";
import { MultisigRepository } from "../repository/MultisigRepository";
import { TransactionRepository } from "../repository/TransactionRepository";
import { MetadataRepository } from "../repository/MetadataRepository";
import * as ss58 from "@subsquid/ss58";
import { SS58_PREFIX } from "../common/constants";
import {
  uint8ArrayToHexString,
  concatenateUint8Arrays,
} from "../common/helpers";
import { TransactionStatus } from "../model";
import { ApprovalOrRejectionRecord } from "../common/types";
import {
  MultisigError_EnvExecutionFailed,
  MultisigError_LangExecutionFailed,
} from "../abi/multisig";
import { decodeTx } from "../common/decode";

export class MultisigEventHandler {
  private multisigRepository: MultisigRepository;
  private transactionRepository: TransactionRepository;
  private metadataRepository: MetadataRepository;

  constructor(
    multisigRepository: MultisigRepository,
    transactionRepository: TransactionRepository,
    metadataRepository: MetadataRepository
  ) {
    this.multisigRepository = multisigRepository;
    this.transactionRepository = transactionRepository;
    this.metadataRepository = metadataRepository;
  }

  async handleEvent(
    contractAddressHex: string,
    evenData: string,
    blockHeader: SubstrateBlock
  ) {
    const event = multisig.decodeEvent(evenData);
    switch (event.__kind) {
      case "ThresholdChanged":
        await this.handleThresholdChanged(
          contractAddressHex,
          event,
          blockHeader
        );
        break;
      case "OwnerAdded":
        await this.handleOwnerAdded(contractAddressHex, event, blockHeader);
        break;
      case "OwnerRemoved":
        await this.handleOwnerRemoved(contractAddressHex, event, blockHeader);
        break;
      case "TransactionProposed":
        await this.handleTransactionProposed(
          contractAddressHex,
          event,
          blockHeader
        );
        break;
      case "TransactionExecuted":
        await this.handleTransactionExecuted(
          contractAddressHex,
          event,
          blockHeader
        );
        break;
      case "TransactionCancelled":
        await this.handleTransactionCancelled(
          contractAddressHex,
          event,
          blockHeader
        );
        break;

      case "Approve":
        await this.handleApprove(contractAddressHex, event, blockHeader);
        break;
      case "Reject":
        await this.handleReject(contractAddressHex, event, blockHeader);
        break;
    }
  }

  private async handleThresholdChanged(
    contractAddressHex: string,
    event: multisig.Event_ThresholdChanged,
    blockHeader: SubstrateBlock
  ) {
    await this.fetchMultisigDataFromDBIfNeeded(contractAddressHex);
    multisigData[contractAddressHex].threshold = event.threshold;
  }

  private async handleOwnerAdded(
    contractAddressHex: string,
    event: multisig.Event_OwnerAdded,
    blockHeader: SubstrateBlock
  ) {
    await this.fetchMultisigDataFromDBIfNeeded(contractAddressHex);
    multisigData[contractAddressHex].owners.push(
      ss58.codec(SS58_PREFIX).encode(event.owner)
    );
  }

  private async handleOwnerRemoved(
    contractAddressHex: string,
    event: multisig.Event_OwnerRemoved,
    blockHeader: SubstrateBlock
  ) {
    await this.fetchMultisigDataFromDBIfNeeded(contractAddressHex);
    multisigData[contractAddressHex].owners = multisigData[
      contractAddressHex
    ].owners.filter(
      (owner) => owner !== ss58.codec(SS58_PREFIX).encode(event.owner)
    );
  }

  private async handleTransactionProposed(
    contractAddressHex: string,
    event: multisig.Event_TransactionProposed,
    blockHeader: SubstrateBlock
  ) {
    const newTransactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    existingTransactions.add(newTransactionId);
    transactionData[newTransactionId] = await this.createTransactionData(
      newTransactionId,
      contractAddressHex,
      event,
      blockHeader,
      TransactionStatus.PROPOSED
    );

    const newApprovalId =
      newTransactionId + "-" + uint8ArrayToHexString(event.proposer);

    approvals.push(
      this.createApprovalOrRejectionRecord(
        newApprovalId,
        newTransactionId,
        event.proposer,
        blockHeader
      )
    );

    try {
      console.log("enter try");
      const contractMetadata =
        await this.metadataRepository.findByContractAddressHex([
          contractAddressHex,
        ]);
      console.log("contractMetadata: ", contractMetadata);
      //TODO: if contractMetadata is empty we should not decode the tx
      if (contractMetadata[0]) {
        const txData = uint8ArrayToHexString(
          concatenateUint8Arrays([event.selector, event.input])
        );
        const decodedTx = decodeTx(contractMetadata[0], txData);
        console.log("decodedTx: ", decodedTx);
      } else {
        console.log("contractMetadata is empty");
      }
      console.log("AAAAAAAA");
      console.log("leave try");
    } catch (e) {
      console.log("error", e);
    }
  }

  private async handleTransactionExecuted(
    contractAddressHex: string,
    event: multisig.Event_TransactionExecuted,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    this.updateTransactionData(
      transactionId,
      blockHeader,
      event.result.__kind === "Success"
        ? TransactionStatus.EXECUTED_SUCCESS
        : TransactionStatus.EXECUTED_FAILURE
    );

    if (event.result.__kind === "Failed") {
      transactionData[transactionId].error = this.getErrorMessage(event.result);
    }
  }

  private async handleTransactionCancelled(
    contractAddressHex: string,
    event: multisig.Event_TransactionCancelled,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    this.updateTransactionData(
      transactionId,
      blockHeader,
      TransactionStatus.CANCELLED
    );
  }

  private async handleApprove(
    contractAddressHex: string,
    event: multisig.Event_Approve,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    transactionData[transactionId].approvalCount += 1;

    const newApprovalId =
      transactionId + "-" + uint8ArrayToHexString(event.owner);

    approvals.push(
      this.createApprovalOrRejectionRecord(
        newApprovalId,
        transactionId,
        event.owner,
        blockHeader
      )
    );
  }

  private async handleReject(
    contractAddressHex: string,
    event: multisig.Event_Reject,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    transactionData[transactionId].rejectionCount += 1;

    const newRejectionId =
      transactionId + "-" + uint8ArrayToHexString(event.owner);

    rejections.push(
      this.createApprovalOrRejectionRecord(
        newRejectionId,
        transactionId,
        event.owner,
        blockHeader
      )
    );
  }

  private async fetchMultisigDataFromDBIfNeeded(contractAddressHex: string) {
    if (!existingMultisigs.get(contractAddressHex)) {
      multisigData[contractAddressHex] = (
        await this.multisigRepository.findByAddressHex([contractAddressHex])
      )[0]; //This must exist and be unique

      // Set map to true to indicate that we have the content on multisigData
      existingMultisigs.set(contractAddressHex, true);
    }
  }

  private createTransactionId(contractAddressHex: string, txId: bigint) {
    return contractAddressHex + "-" + txId;
  }

  private async fetchTransactionDataFromDBIfNeeded(transactionId: string) {
    if (!existingTransactions.has(transactionId)) {
      let dbTx = (
        await this.transactionRepository.findById([transactionId])
      )[0]; //This must exist and be unique
      transactionData[transactionId] = {
        ...dbTx,
        multisig: dbTx.multisig.addressHex,
      };
      existingTransactions.add(transactionId);
    }
  }

  //TODO: remove async from this fn and extract the decoding process to a separate function
  private async createTransactionData(
    newTransactionId: string,
    contractAddressHex: string,
    event: multisig.Event_TransactionProposed,
    blockHeader: SubstrateBlock,
    status: TransactionStatus
  ) {
    return {
      id: newTransactionId,
      multisig: contractAddressHex,
      txId: event.txId,
      proposer: ss58.codec(SS58_PREFIX).encode(event.proposer),
      contractAddress: ss58.codec(SS58_PREFIX).encode(event.contractAddress),
      selector: uint8ArrayToHexString(event.selector),
      args: uint8ArrayToHexString(event.input),
      value: event.transferredValue,
      status: status,
      error: "",
      approvalCount: 1,
      rejectionCount: 0,
      lastUpdatedTimestamp: new Date(blockHeader.timestamp),
      lastUpdatedBlockNumber: blockHeader.height,
    };
  }

  private updateTransactionData(
    transactionId: string,
    blockHeader: SubstrateBlock,
    status: TransactionStatus
  ) {
    transactionData[transactionId].lastUpdatedTimestamp = new Date(
      blockHeader.timestamp
    );
    transactionData[transactionId].lastUpdatedBlockNumber = blockHeader.height;
    transactionData[transactionId].status = status;
  }

  private getErrorMessage(
    result: multisig.Event_TransactionExecuted["result"]
  ) {
    if ("__kind" in result.value) {
      if (result.value.__kind === "EnvExecutionFailed") {
        let error = result.value as MultisigError_EnvExecutionFailed;
        return result.value.__kind + ": " + error.value;
      } else if (result.value.__kind === "LangExecutionFailed") {
        let error = result.value as MultisigError_LangExecutionFailed;
        return result.value.__kind + ": " + error.value.__kind;
      } else {
        return result.value.__kind;
      }
    }
  }

  private createApprovalOrRejectionRecord(
    id: string,
    transactionId: string,
    owner: Uint8Array,
    blockHeader: SubstrateBlock
  ) {
    return {
      id: id,
      transaction: transactionId,
      caller: ss58.codec(SS58_PREFIX).encode(owner),
      timestamp: new Date(blockHeader.timestamp),
      blockNumber: blockHeader.height,
    };
  }
}
