import type { Prisma } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class CategoryRepository {
  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  }

  async findById(id: string, storeId: string) {
    return prisma.category.findFirst({
      where: { id, storeId },
    });
  }

  async countChildren(id: string, storeId: string) {
    return prisma.category.count({
      where: { parentId: id, storeId },
    });
  }

  async deleteMany(ids: string[], storeId: string) {
    return prisma.category.deleteMany({
      where: { id: { in: ids }, storeId },
    });
  }

  async findAllByStore(storeId: string) {
    return prisma.category.findMany({
      where: { storeId },
      include: {
        _count: {
          select: { children: true },
        },
      },
    });
  }
}
