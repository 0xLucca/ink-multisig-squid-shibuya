import { Metadata } from "../model";
import { Ctx } from "../processor";
import { In } from "typeorm";

export class MetadataRepository {
  private ctx: Ctx;

  constructor(ctx: Ctx) {
    this.ctx = ctx;
  }

  async findByContractAddressHex(
    contractAddressesHex: string[]
  ): Promise<Metadata[]> {
    return await this.ctx.store.findBy(Metadata, {
      contractAddress: In([...contractAddressesHex]),
    });
  }
}
