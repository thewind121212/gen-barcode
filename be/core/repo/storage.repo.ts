import prisma from "@Ciri/core/prisma";

import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class StorageRepository {
  async create(data: Prisma.StorageCreateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storage.create({
      data,
    });
  }
}
