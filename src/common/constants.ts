import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";

const FACTORY_ADDRESS_SS58 = "bgzZgSNXh2wqApuFbP1pzs9MBWJUcGdzRbFSkZp3J4SPWgq";
const FACTORY_ADDRESS = toHex(ss58.decode(FACTORY_ADDRESS_SS58).bytes);
const SS58_PREFIX = ss58.decode(FACTORY_ADDRESS_SS58).prefix;
const FACTORY_DEPLOYMENT_BLOCK = 4438254;

export { FACTORY_ADDRESS, FACTORY_ADDRESS_SS58, SS58_PREFIX, FACTORY_DEPLOYMENT_BLOCK };