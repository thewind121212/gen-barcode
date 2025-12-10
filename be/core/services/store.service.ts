import type { RequestContext } from "@Ciri/middlewares";

import { StoreRole } from "../../generated/prisma/enums.js";
import { env } from "@Ciri/env";
import { StorageRepository } from "@Ciri/repo/storage.repo";
import { StoreMemberRepository } from "@Ciri/repo/store-member.repo";
import { StoreRepository } from "@Ciri/repo/store.repo";
import { LogLevel, LogType, UnitLogger } from "@Ciri/utils/logger";

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

  async CreateStore(ctx: RequestContext, name: string): Promise<{ storeId?: string | null; error?: string | null }> {
    try {
      const { userId } = ctx;
      if (!userId) {
        throw new Error("User ID is required");
      }
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
      return { storeId: null, error: (error as Error).message };
    }
  }
}
