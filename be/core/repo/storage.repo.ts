import prisma from "@Ciri/core/prisma";

import type { Prisma } from "../../generated/prisma/client.js";

export class StorageRepository {
  async create(data: Prisma.StorageCreateInput) {
    return prisma.storage.create({
      data,
    });
  }
}
