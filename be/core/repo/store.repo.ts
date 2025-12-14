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
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.store.delete({
      where: { id },
    });
  }

  async findById(id: string) {
    return prisma.store.findUnique({
      where: { id },
    });
  }

  async getStoreEnrolledByUserId(userId: string) {
    return prisma.storeMember.count({
      where: { userId },
    });
  }
}
