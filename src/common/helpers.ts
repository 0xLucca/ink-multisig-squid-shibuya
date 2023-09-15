export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return (
    "0x" +
    Array.from(uint8Array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    )
  );
}

export function toEntityMap<E extends { addressHex: string }>(
  entities: E[]
): Map<string, E> {
  return new Map(entities.map((e) => [e.addressHex, e]));
}

export function toEntityMapTx<E extends { id: string }>(
  entities: E[]
): Map<string, E> {
  return new Map(entities.map((e) => [e.id, e]));
}

export function concatenateUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  // Calculate the total length of the combined arrays
  let totalLength = 0;
  for (const array of arrays) {
    totalLength += array.length;
  }

  // Create a new Uint8Array with the total length
  const resultArray = new Uint8Array(totalLength);

  // Copy each array into the result array
  let offset = 0;
  for (const array of arrays) {
    resultArray.set(array, offset);
    offset += array.length;
  }

  return resultArray;
}

