import type { CreateStoreRequestBody, CreateStoreResponseServices } from "@Ciri/core/api/store/store.routes";
import type { RequestContext } from "@Ciri/core/middlewares";

import { env } from "@Ciri/core/env";
import { StorageRepository } from "@Ciri/core/repo/storage.repo";
import { StoreMemberRepository } from "@Ciri/core/repo/store-member.repo";
import { StoreRepository } from "@Ciri/core/repo/store.repo";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { StoreRole } from "@Ciri/generated/prisma/enums.js";

export class StoreService {
  private storeRepo: StoreRepository;
  private storeMemberRepo: StoreMemberRepository;
  private storageRepo: StorageRepository;

  constructor() {
    this.storeRepo = new StoreRepository();
    this.storeMemberRepo = new StoreMemberRepository();
    this.storageRepo = new StorageRepository();
  }

  async getStoreEnrolledByUserId(userId: string) {
    return await this.storeRepo.getStoreEnrolledByUserId(userId);
  }

  async CreateStore(ctx: RequestContext, req: CreateStoreRequestBody): Promise<CreateStoreResponseServices> {
    try {
      const { userId } = ctx;
      if (!userId) {
        throw new Error("User ID is required");
      }
      const { name } = req;
      const store = await this.storeRepo.create({
        name,
      });

      const storeEnrolled = await this.getStoreEnrolledByUserId(userId);
      if (storeEnrolled >= env.MAX_STORE_BY_USER) {
        throw new Error("User has reached the maximum number of stores");
      }

      await this.storeMemberRepo.create({
        userId,
        store: { connect: { id: store.id } },
        role: StoreRole.OWNER,
      });

      await this.storageRepo.create({
        store: { connect: { id: store.id } },
        location: "Default Location",
        capacity: 100,
      });

      return { storeId: store.id.toString(), error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "Store Create:", LogLevel.ERROR, (error as Error).message);
      return { storeId: undefined, error: (error as Error).message };
    }
  }
}
