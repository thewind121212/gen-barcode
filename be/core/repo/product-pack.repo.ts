import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class ProductPackRepository {
  async create(data: Prisma.ProductPackCreateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.productPack.create({ data });
  }

  async findById(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.productPack.findFirst({
      where: { id, storeId },
    });
  }

  async findByProductId(productId: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.productPack.findMany({
      where: { productId, storeId },
    });
  }
}
