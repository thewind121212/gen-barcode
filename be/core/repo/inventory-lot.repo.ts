import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class InventoryLotRepository {
  async closeLotsForStorage(
    storageId: string,
    storeId: string,
    db?: PrismaClient | Prisma.TransactionClient,
  ) {
    const client = db ?? prisma;
    return client.inventoryLot.updateMany({
      where: { storageId, storeId },
      data: { status: "CLOSED" },
    });
  }
}


