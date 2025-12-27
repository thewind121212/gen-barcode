import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class StorageActiveLotRepository {
  async clearActiveLotForStorage(
    storageId: string,
    storeId: string,
    db?: PrismaClient | Prisma.TransactionClient,
  ) {
    const client = db ?? prisma;
    return client.storageActiveLot.updateMany({
      where: { storageId, storage: { storeId } },
      data: { activeLotId: null },
    });
  }
}


