import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class StorageRepository {
  async create(data: Prisma.StorageCreateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storage.create({
      data,
    });
  }

  async findById(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storage.findUnique({
      where: { id, storeId, isDelete: false },
    });
  }

  async findAllByStore(storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storage.findMany({
      where: { storeId, isDelete: false },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    });
  }

  async unsetPrimaryByStore(storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storage.updateMany({
      where: { storeId, isDelete: false, isPrimary: false },
      data: { isPrimary: false },
    });
  }

  async findAnyPrimaryByStoreId(storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storage.count({
      where: { storeId, isDelete: false, isPrimary: true },
    });
  }
}
