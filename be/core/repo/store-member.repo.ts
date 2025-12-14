import type { Prisma } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class StoreMemberRepository {
  async create(data: Prisma.StoreMemberCreateInput) {
    return prisma.storeMember.create({
      data,
    });
  }

  async findByStoreId(storeId: string) {
    return prisma.storeMember.findMany({
      where: { storeId },
    });
  }
}
