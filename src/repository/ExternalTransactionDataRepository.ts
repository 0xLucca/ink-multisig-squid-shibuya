import { Ctx } from "../processor";
import { ExternalTransactionData } from "../model";

export class ExternalTransactionDataRepository {
  private ctx: Ctx;

  constructor(ctx: Ctx) {
    this.ctx = ctx;
  }

  async findOneById(id: string): Promise<ExternalTransactionData | undefined> {
    return await this.ctx.store.findOneBy(ExternalTransactionData, {
      id: id,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.ctx.store.remove(ExternalTransactionData, id);
  }
}
