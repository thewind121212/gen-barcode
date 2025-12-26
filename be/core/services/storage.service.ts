import { validate as validateUuid } from "uuid";

import type { CreateStorageRequestBody, CreateStorageResponseServices, GetStorageByIdRequestQuery, GetStorageByIdResponseServices, GetStorageByStoreIdOverviewResponseServices, GetStorageByStoreIdRequestQuery, GetStorageByStoreIdResponseServices } from "@Ciri/core/api/storage/storage.routes";
import type { RequestContext } from "@Ciri/core/middlewares";
import type { StorageResponse, StorageResponseOverview } from "@Ciri/types/storage";

import prisma from "@Ciri/core/prisma";
import { StorageRepository } from "@Ciri/core/repo/storage.repo";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";

type ProtoTimestamp = { seconds: number; nanos: number };

function toProtoTimestamp(date: Date): ProtoTimestamp {
  const ms = date.getTime();
  const seconds = Math.floor(ms / 1000);
  const nanos = (ms - seconds * 1000) * 1_000_000;
  return { seconds, nanos };
}

export class StorageService {
  private storageRepo: StorageRepository;

  constructor() {
    this.storageRepo = new StorageRepository();
  }

  private ensureUserId(ctx: RequestContext): string {
    const { userId } = ctx;
    if (!userId) {
      throw new Error("User ID is required");
    }
    return userId;
  }

  private ensureStoreId(ctx: RequestContext, fallbackStoreId?: string): string {
    const storeId = ctx.storeId ?? fallbackStoreId;
    if (!storeId) {
      throw new Error("Store ID is required");
    }
    if (!validateUuid(storeId)) {
      throw new Error("Store ID is invalid");
    }
    return storeId;
  }

  private ensureStorageId(storageId: string): string {
    if (!storageId) {
      throw new Error("storageId is required");
    }
    if (!validateUuid(storageId)) {
      throw new Error("storageId is invalid");
    }
    return storageId;
  }

  private storageBase = (entity: {
    id: string;
    storeId: string;
    name?: string | null;
    location?: string | null;
    isDelete?: boolean;
    isPrimary?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) => {
    return {
      id: entity.id,
      storeId: entity.storeId,
      name: entity.name ?? "Main Warehouse",
      location: entity.location ?? undefined,
      isDelete: Boolean(entity.isDelete ?? false),
      isPrimary: Boolean(entity.isPrimary ?? false),
      createdAt: toProtoTimestamp(entity.createdAt ?? new Date(0)) as any,
      updatedAt: toProtoTimestamp(entity.updatedAt ?? new Date(0)) as any,
    };
  };

  private storageBaseOverview = (entity: {
    id: string;
    storeId: string;
    name?: string | null;
    isDelete?: boolean;
    isPrimary?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) => {
    return {
      id: entity.id,
      storeId: entity.storeId,
      name: entity.name ?? "Main Warehouse",
      isDelete: Boolean(entity.isDelete ?? false),
      isPrimary: Boolean(entity.isPrimary ?? false),
      createdAt: toProtoTimestamp(entity.createdAt ?? new Date(0)) as any,
      updatedAt: toProtoTimestamp(entity.updatedAt ?? new Date(0)) as any,
    };
  };

  private toStorageResponse = (entity: {
    id: string;
    storeId: string;
    name?: string | null;
    isDelete?: boolean;
    isPrimary?: boolean;
    color?: string | null;
    address?: string | null;
    active?: boolean;
    icon?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): StorageResponse => {
    return {
      ...this.storageBase(entity),
      color: entity.color ?? undefined,
      icon: entity.icon ?? undefined,
      address: entity.address ?? undefined,
      active: Boolean(entity.active ?? true),
    } as StorageResponse;
  };

  private toStorageResponseOverview = (entity: {
    id: string;
    storeId: string;
    name?: string | null;
    isDelete?: boolean;
    isPrimary?: boolean;
    color?: string | null;
    address?: string | null;
    active?: boolean;
    icon?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    itemCount?: number;
    totalValue?: number;
    lowStockValue?: number;
  }): StorageResponseOverview => {
    return {
      ...this.storageBaseOverview(entity),
      color: entity.color ?? undefined,
      icon: entity.icon ?? undefined,
      address: entity.address ?? undefined,
      active: Boolean(entity.active ?? true),
      itemCount: Number(entity.itemCount ?? 0),
      totalValue: Number(entity.totalValue ?? 0),
      lowStockValue: Number(entity.lowStockValue ?? 0),
    };
  };

  async CreateStorage(ctx: RequestContext, req: CreateStorageRequestBody): Promise<CreateStorageResponseServices> {
    try {
      this.ensureUserId(ctx);
      const storeId = this.ensureStoreId(ctx, (req as any)?.storeId);

      if (!req.name) {
        throw new Error("name is required");
      }
      const isPrimary = Boolean((req as any)?.isPrimary ?? false);

      const created = await prisma.$transaction(async (tx) => {
        if (isPrimary) {
          const anyPrimary = await this.storageRepo.findAnyPrimaryByStoreId(storeId, tx);
          if (anyPrimary > 0) {
            throw new Error("Primary storage already exists");
          }
        }
        return await this.storageRepo.create(
          {
            store: { connect: { id: storeId } },
            name: req.name,
            active: req.active ?? true,
            isPrimary,
            address: req.address ?? undefined,
            color: req.color ?? undefined,
            icon: req.icon ?? undefined,
          },
          tx,
        );
      });

      return { resData: { storageId: created.id }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Storage Create", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetStorageById(ctx: RequestContext, req: GetStorageByIdRequestQuery): Promise<GetStorageByIdResponseServices> {
    try {
      this.ensureUserId(ctx);
      const storeId = this.ensureStoreId(ctx, (req as any)?.storeId);
      const storageId = this.ensureStorageId((req as any)?.storageId);

      const storage = await this.storageRepo.findById(storageId, storeId);
      if (!storage) {
        throw new Error("Storage not found");
      }

      return { resData: this.toStorageResponse(storage), error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Storage Get", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetStorageByStoreId(
    ctx: RequestContext,
    req: GetStorageByStoreIdRequestQuery,
  ): Promise<GetStorageByStoreIdResponseServices> {
    try {
      this.ensureUserId(ctx);
      const storeId = this.ensureStoreId(ctx, (req as any)?.storeId);

      const storage = await this.storageRepo.findAllByStore(storeId);
      if (!storage) {
        throw new Error("Storage not found");
      }

      return { resData: { storages: storage.map(s => this.toStorageResponse(s)) }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Storage Get", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetStorageByStoreIdOverview(
    ctx: RequestContext,
    req: GetStorageByStoreIdRequestQuery,
  ): Promise<GetStorageByStoreIdOverviewResponseServices> {
    try {
      this.ensureUserId(ctx);
      const storeId = this.ensureStoreId(ctx, (req as any)?.storeId);
      const storage = await this.storageRepo.findAllByStore(storeId);
      if (!storage) {
        throw new Error("Storage not found");
      }

      return { resData: { storages: storage.map(s => this.toStorageResponseOverview(s)) }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Storage Get", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }
}
