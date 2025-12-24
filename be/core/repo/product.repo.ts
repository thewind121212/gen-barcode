import prisma from "@Ciri/core/prisma";
import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

export class ProductRepository {
  private async softDeleteMany(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.product.updateMany({
      where: { id: { in: ids }, storeId, isDelete: false },
      data: { isDelete: true },
    });
  }

  async create(data: Prisma.ProductCreateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.product.create({ data });
  }

  async findById(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.product.findFirst({
      where: { id, storeId, isDelete: false },
    });
  }

  async findByIdWithRelations(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.product.findFirst({
      where: { id, storeId, isDelete: false },
      include: {
        packs: { include: { barcodes: true } },
        barcodes: true,
      },
    });
  }

  async findByIds(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.product.findMany({
      where: { id: { in: ids }, storeId, isDelete: false },
    });
  }

  async findOneAndUpdate(id: string, data: Prisma.ProductUpdateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.product.update({
      where: { id, isDelete: false },
      data,
    });
  }

  async deleteById(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    return this.softDeleteMany([id], storeId, db);
  }

  async deleteMany(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    return this.softDeleteMany(ids, storeId, db);
  }
}
