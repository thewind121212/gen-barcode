import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class ProductBarcodeRepository {
  async createMany(data: Prisma.ProductBarcodeCreateManyInput[], db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    if (!data.length) {
      return { count: 0 };
    }
    return client.productBarcode.createMany({ data });
  }

  async findByProductId(productId: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.productBarcode.findMany({
      where: { productId, storeId },
    });
  }
}
