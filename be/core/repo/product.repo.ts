import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";
import { InventoryBalanceRepository } from "@Ciri/core/repo/inventory-balance.repo";
import { InventoryLotRepository } from "@Ciri/core/repo/inventory-lot.repo";
import { StorageActiveLotRepository } from "@Ciri/core/repo/storage-active-lot.repo";

export class ProductRepository {
  private storageActiveLotRepo: StorageActiveLotRepository;
  private inventoryLotRepo: InventoryLotRepository;
  private inventoryBalanceRepo: InventoryBalanceRepository;

  constructor() {
    this.storageActiveLotRepo = new StorageActiveLotRepository();
    this.inventoryLotRepo = new InventoryLotRepository();
    this.inventoryBalanceRepo = new InventoryBalanceRepository();
  }

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

  async unsetStorageById(storageId: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const [activeLots, lots, balances] = await Promise.all([
      this.storageActiveLotRepo.clearActiveLotForStorage(storageId, storeId, db),
      this.inventoryLotRepo.closeLotsForStorage(storageId, storeId, db),
      this.inventoryBalanceRepo.deleteByStorage(storageId, storeId, db),
    ]);

    return { activeLots, lots, balances };
  }

  async deleteById(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    return this.softDeleteMany([id], storeId, db);
  }

  async deleteMany(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    return this.softDeleteMany(ids, storeId, db);
  }
}
