import { Abi } from "@subsquid/ink-abi";
import { Metadata } from "../model";

export function decodeTx(
  metadata: Metadata,
  hex: string
): string {
  // Convert the Uint8Array to a Buffer
  const bufferData = Buffer.from(metadata.content);

  // Decode the JSON data
  const jsonData = JSON.parse(bufferData.toString());

  // Print the JSON data
  //console.log("JSON Data:", jsonData);
  const _abi = new Abi(jsonData);
  const messageDecoded = _abi.decodeMessage(hex);
  console.log("messageDecoded", messageDecoded);
  return messageDecoded;
}
