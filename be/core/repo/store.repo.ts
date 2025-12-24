import type { Prisma, PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class StoreRepository {
  async create(data: Prisma.StoreCreateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.store.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StoreUpdateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.store.update({
      where: { id, isDelete: false },
      data,
    });
  }

  async delete(id: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.store.delete({
      where: { id, isDelete: false },
    });
  }

  async findById(id: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.store.findUnique({
      where: { id, isDelete: false },
    });
  }

  async getStoreEnrolledByUserId(userId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.storeMember.count({
      where: { userId },
    });
  }

  async findByUserId(userId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.store.findMany({
      where: { members: { some: { userId } }, isDelete: false },
    });
  }
}
