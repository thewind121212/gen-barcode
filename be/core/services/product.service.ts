import { randomUUID } from "node:crypto";
import { validate as validateUuid } from "uuid";

import type {
  CreateProductRequestBody,
  CreateProductResponseServices,
  GetProductByIdRequestQuery,
  GetProductByIdResponseServices,
} from "@Ciri/core/api/product/product.routes";
import type { RequestContext } from "@Ciri/core/middlewares";
import type { ProductResponse } from "@Ciri/types/product";

import { getPrisma } from "@Ciri/core/prisma";
import { ProductBarcodeRepository } from "@Ciri/core/repo/product-barcode.repo";
import { ProductPackRepository } from "@Ciri/core/repo/product-pack.repo";
import { ProductRepository } from "@Ciri/core/repo/product.repo";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { Prisma } from "@Ciri/generated/prisma/client.js";
import { BarcodeKind } from "@Ciri/generated/prisma/enums.js";

function toNumberSafe(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  if (value && typeof (value as any).toNumber === "function") {
    const n = (value as any).toNumber();
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(value as any);
  return Number.isFinite(n) ? n : 0;
}

export class ProductService {
  private prisma = getPrisma();
  private productRepo: ProductRepository;
  private packRepo: ProductPackRepository;
  private barcodeRepo: ProductBarcodeRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.packRepo = new ProductPackRepository();
    this.barcodeRepo = new ProductBarcodeRepository();
  }

  private ensureStoreId(ctx: RequestContext): string {
    const storeId = ctx.storeId;
    if (!storeId) {
      throw new Error("Store ID is required");
    }
    if (!validateUuid(storeId)) {
      throw new Error("Store ID is invalid");
    }
    return storeId;
  }

  private mapProductResponse(entity: any): ProductResponse {
    return {
      id: entity.id,
      storeId: entity.storeId,
      categoryId: entity.categoryId ?? undefined,
      description: entity.description ?? undefined,
      imageUrl: entity.imageUrl ?? undefined,
      name: entity.name,
      status: entity.status,
      isDelete: entity.isDelete,
      baseUnitCode: entity.baseUnitCode,
      baseUnitLabel: entity.baseUnitLabel ?? undefined,
      sellPrice: toNumberSafe(entity.sellPrice),
      exportPrice: entity.exportPrice ? toNumberSafe(entity.exportPrice) : undefined,
      trackingMode: entity.trackingMode,
      containerLabel: entity.containerLabel ?? undefined,
      containerSize: entity.containerSize ? toNumberSafe(entity.containerSize) : undefined,
      packs: (entity.packs ?? []).map((p: any) => ({
        id: p.id,
        storeId: p.storeId,
        productId: p.productId,
        name: p.name,
        multiplier: p.multiplier,
        sellPrice: p.sellPrice == null ? undefined : toNumberSafe(p.sellPrice),
        barcodes: (p.barcodes ?? []).map((b: any) => ({
          id: b.id,
          storeId: b.storeId,
          value: b.value,
          productId: b.productId,
          packId: b.packId ?? undefined,
          isActive: true,
        })),
      })),
      barcodes: (entity.barcodes ?? []).map((b: any) => ({
        id: b.id,
        storeId: b.storeId,
        value: b.value,
        productId: b.productId,
        packId: b.packId ?? undefined,
        isActive: true,
      })),
    };
  }

  async CreateProduct(ctx: RequestContext, req: CreateProductRequestBody): Promise<CreateProductResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);
      if (!ctx.userId) {
        throw new Error("User ID is required");
      }

      const internalBarcodeValue = randomUUID();

      const created = await this.prisma.$transaction(async (tx) => {
        const productCreate: Prisma.ProductCreateInput = {
          store: { connect: { id: storeId } },
          name: req.name,
          description: req.description,
          imageUrl: req.imageUrl,
          // Request validation ensures these are valid values.
          status: (req as any).status ?? "ACTIVE",
          baseUnitCode: (req as any).baseUnitCode ?? "each",
          baseUnitLabel: (req as any).baseUnitLabel, // New field
          sellPrice: new Prisma.Decimal((req as any).sellPrice),
          exportPrice: (req as any).exportPrice ? new Prisma.Decimal((req as any).exportPrice) : undefined, // New field
          trackingMode: (req as any).trackingMode ?? "TOTAL_ONLY", // New field
          containerLabel: (req as any).containerLabel, // New field
          containerSize: (req as any).containerSize ? new Prisma.Decimal((req as any).containerSize) : undefined, // New field
        };

        if (req.categoryId) {
          productCreate.category = { connect: { id: req.categoryId } };
        }

        const product = await this.productRepo.create(productCreate, tx);

        // Product-level barcodes (includes required INTERNAL barcode)
        await this.barcodeRepo.createMany([
          {
            storeId,
            productId: product.id,
            value: internalBarcodeValue,
            kind: BarcodeKind.INTERNAL,
          },
          ...(req.barcodes ?? []).map(b => ({
            storeId,
            productId: product.id,
            value: b.value,
            kind: BarcodeKind.ALIAS,
          })),
        ], tx);

        // Packs + pack-level barcodes
        for (const p of (req.packs ?? [])) {
          const pack = await this.packRepo.create({
            storeId,
            product: { connect: { id: product.id } },
            name: p.name,
            multiplier: p.multiplier,
            sellPrice: p.sellPrice == null ? undefined : new Prisma.Decimal(p.sellPrice as any),
          }, tx);

          if (p.barcodes?.length) {
            await this.barcodeRepo.createMany(
              p.barcodes.map(b => ({
                storeId,
                productId: product.id,
                packId: pack.id,
                value: b.value,
                kind: BarcodeKind.ALIAS,
              })),
              tx,
            );
          }
        }

        return product;
      });

      return { resData: { productId: created.id }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Product Create", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetProductById(ctx: RequestContext, req: GetProductByIdRequestQuery): Promise<GetProductByIdResponseServices> {
    try {
      const storeId = this.ensureStoreId(ctx);

      // Quick existence check via repository (keeps service style consistent).
      const exists = await this.productRepo.findById(req.productId, storeId);
      if (!exists) {
        return { resData: null, error: "Product not found" };
      }

      const product = await this.productRepo.findByIdWithRelations(req.productId, storeId);

      if (!product) {
        return { resData: null, error: "Product not found" };
      }

      return { resData: this.mapProductResponse(product), error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Product Get", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }
}
