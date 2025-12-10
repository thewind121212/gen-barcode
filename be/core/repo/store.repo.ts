import type { Prisma } from "../../generated/prisma/client.js";

import prisma from "@Ciri/prisma";

export class StoreRepository {
  async create(data: Prisma.StoreCreateInput) {
    return prisma.store.create({
      data,
    });
  }

  async update(id: number, data: Prisma.StoreUpdateInput) {
    return prisma.store.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.store.delete({
      where: { id },
    });
  }

  async findById(id: number) {
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
