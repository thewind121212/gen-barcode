import type { Prisma } from "../../generated/prisma/client.js";

import prisma from "@Ciri/prisma";

export class StoreMemberRepository {
  async create(data: Prisma.StoreMemberCreateInput) {
    return prisma.storeMember.create({
      data,
    });
  }

  async findByStoreId(storeId: number) {
    return prisma.storeMember.findMany({
      where: { storeId },
    });
  }
}
