import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class InventoryBalanceRepository {
  async deleteByStorage(
    storageId: string,
    storeId: string,
    db?: PrismaClient | Prisma.TransactionClient,
  ) {
    const client = db ?? prisma;
    return client.inventoryBalance.deleteMany({
      where: { storageId, storeId },
    });
  }
}
