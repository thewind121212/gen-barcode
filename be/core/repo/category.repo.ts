import type { Category, Prisma, type PrismaClient } from "@Ciri/generated/prisma/client";

import prisma from "@Ciri/core/prisma";

export class CategoryRepository {
  async create(data: Prisma.CategoryCreateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.create({ data });
  }

  async findById(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.findFirst({
      where: { id, storeId, isDelete: false },
    });
  }

  async findByIds(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.findMany({
      where: { id: { in: ids }, storeId, isDelete: false },
    });
  }

  async findOneAndUpdate(id: string, data: Prisma.CategoryUpdateInput, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.update({
      where: { id, isDelete: false },
      data,
    });
  }

  async softDelete(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    return this.softDeleteMany([id], storeId, db);
  }

  async unLinkParentCategoryById(categoryId: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.update({
      where: { id: categoryId, storeId, isDelete: false },
      data: { parentId: null },
    });
  }

  async softDeleteMany(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    if (ids.length === 0)
      return 0;
    return client.$executeRaw`
      WITH RECURSIVE subtree AS (
        SELECT id
        FROM "Category"
        WHERE id IN (${Prisma.join(ids)})
          AND "storeId" = ${storeId}
          AND "isDelete" = false
        UNION ALL
        SELECT c.id
        FROM "Category" c
        JOIN subtree s ON c."parentId" = s.id
        WHERE c."storeId" = ${storeId}
          AND c."isDelete" = false
      )
      UPDATE "Category"
      SET "isDelete" = true
      WHERE id IN (SELECT id FROM subtree);
    `;
  }

  async countChildren(id: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.count({
      where: { parentId: id, storeId, isDelete: false },
    });
  }

  async countDescendants(rootId: string, storeId: string, db?: PrismaClient | Prisma.TransactionClient): Promise<number> {
    const client = db ?? prisma;
    const rows = await client.$queryRaw<Array<{ count: bigint }>>`
      WITH RECURSIVE subtree AS (
        SELECT id
        FROM "Category"
        WHERE id = ${rootId}
          AND "storeId" = ${storeId}
          AND "isDelete" = false
        UNION ALL
        SELECT c.id
        FROM "Category" c
        JOIN subtree s ON c."parentId" = s.id
        WHERE c."storeId" = ${storeId}
          AND c."isDelete" = false
      )
      SELECT (COUNT(*) - 1) AS count
      FROM subtree;
    `;

    const value = rows?.[0]?.count ?? 0n;
    return Number(value);
  }

  async deleteMany(ids: string[], storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    return client.category.deleteMany({
      where: { id: { in: ids }, storeId, isDelete: false },
    });
  }

  async findAllByStore(storeId: string, db?: PrismaClient | Prisma.TransactionClient) {
    const client = db ?? prisma;
    const rows = await client.$queryRaw<Array<Category & { descendantsCount: bigint }>>`
      WITH RECURSIVE edges AS (
        SELECT id, "parentId"
        FROM "Category"
        WHERE "storeId" = ${storeId}
          AND "isDelete" = false
      ),
      closure AS (
        SELECT id AS ancestor, id AS descendant
        FROM edges
        UNION ALL
        SELECT c.ancestor, e.id
        FROM closure c
        JOIN edges e ON e."parentId" = c.descendant
      ),
      counts AS (
        SELECT ancestor, (COUNT(*) - 1) AS "descendantsCount"
        FROM closure
        GROUP BY ancestor
      )
      SELECT cat.*, COALESCE(counts."descendantsCount", 0) AS "descendantsCount"
      FROM "Category" cat
      LEFT JOIN counts ON counts.ancestor = cat.id
      WHERE cat."storeId" = ${storeId}
        AND cat."isDelete" = false;
    `;

    // Convert bigint count to number for downstream usage.
    return rows.map(r => ({
      ...r,
      descendantsCount: Number(r.descendantsCount ?? 0),
    }));
  }
}
