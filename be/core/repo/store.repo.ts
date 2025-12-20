import type { Prisma } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class StoreRepository {
  async create(data: Prisma.StoreCreateInput) {
    return prisma.store.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StoreUpdateInput) {
    return prisma.store.update({
      where: { id, isDelete: false },
      data,
    });
  }

  async delete(id: string) {
    return prisma.store.delete({
      where: { id, isDelete: false },
    });
  }

  async findById(id: string) {
    return prisma.store.findUnique({
      where: { id, isDelete: false },
    });
  }

  async getStoreEnrolledByUserId(userId: string) {
    return prisma.storeMember.count({
      where: { userId },
    });
  }

  async findByUserId(userId: string) {
    return prisma.store.findMany({
      where: { members: { some: { userId } }, isDelete: false },
    });
  }
}
