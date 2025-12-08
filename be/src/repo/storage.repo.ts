import type { Prisma } from "../../generated/prisma/client.js";
import prisma from "../prisma.js";

export class StorageRepository {
    async create(data: Prisma.StorageCreateInput) {
        return prisma.storage.create({
            data,
        });
    }
}
