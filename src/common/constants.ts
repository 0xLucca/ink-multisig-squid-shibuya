import * as ss58 from "@subsquid/ss58";

const FACTORY_ADDRESS_SS58 = "aoZu9coGWyNk2Ghn455CErz8zzcABQyhGB7dQ3pkDsqRKyJ";
const FACTORY_ADDRESS = ss58.decode(FACTORY_ADDRESS_SS58).bytes;
const SS58_PREFIX = ss58.decode(FACTORY_ADDRESS_SS58).prefix;
const FACTORY_DEPLOYMENT_BLOCK = 4571160;
const PSP22_TRANSFER_SELECTOR = "0xdb20f9f5";
const PSP22_TRANSFER_FROM_SELECTOR = "0x54b3c76e";

export {
  FACTORY_ADDRESS,
  FACTORY_ADDRESS_SS58,
  SS58_PREFIX,
  FACTORY_DEPLOYMENT_BLOCK,
  PSP22_TRANSFER_SELECTOR,
  PSP22_TRANSFER_FROM_SELECTOR,
};
