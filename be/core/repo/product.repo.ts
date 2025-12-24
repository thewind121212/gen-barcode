import prisma from "@Ciri/core/prisma";
import { Prisma } from "@Ciri/generated/prisma/client";

export class ProductRepository {
    private async softDeleteMany(ids: string[], storeId: string) {
        return prisma.product.updateMany({
            where: { id: { in: ids }, storeId, isDelete: false },
            data: { isDelete: true },
        });
    }
    async create(data: Prisma.ProductCreateInput) {
        return prisma.product.create({ data });
    }
    async findById(id: string, storeId: string) {
        return prisma.product.findFirst({
            where: { id, storeId, isDelete: false },
        });
    }
    async findByIds(ids: string[], storeId: string) {
        return prisma.product.findMany({
            where: { id: { in: ids }, storeId, isDelete: false },
        });
    }
    async findOneAndUpdate(id: string, data: Prisma.ProductUpdateInput) {
        return prisma.product.update({
            where: { id, isDelete: false },
            data,
        });
    }
    async deleteById(id: string, storeId: string) {
        return this.softDeleteMany([id], storeId);
    }
    async deleteMany(ids: string[], storeId: string) {
        return this.softDeleteMany(ids, storeId);
    }
}
