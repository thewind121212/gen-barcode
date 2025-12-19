import type { CreateStoreRequestBody, CreateStoreResponseServices, GetUserInfoRequestBody, GetUserInfoResponseServices } from "@Ciri/core/api/store/store.routes";
import type { RequestContext } from "@Ciri/core/middlewares";

import { env } from "@Ciri/core/env";
import { getEmailFromContext } from "@Ciri/core/middlewares";
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

      const storeEnrolled = await this.getStoreEnrolledByUserId(userId);
      if (storeEnrolled >= env.MAX_STORE_BY_USER) {
        return { resData: {
          storeId: undefined,
        }, error: "User has reached the maximum number of stores" };
      }

      const { name } = req;
      const store = await this.storeRepo.create({
        name,
      });

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

      return { resData: { storeId: store.id }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "<Store Create>", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }

  async GetUserInfo(ctx: RequestContext, _req: GetUserInfoRequestBody): Promise<GetUserInfoResponseServices> {
    try {
      const { userId } = ctx;
      if (!userId) {
        throw new Error("User ID is required");
      }

      const storeEntities = await this.storeRepo.findByUserId(userId);

      const storeInfos = storeEntities.map(store => ({ id: store.id, name: store.name }));

      return { resData: { email: getEmailFromContext(ctx), name: "", storeInfos }, error: null };
    }
    catch (error) {
      UnitLogger(LogType.SERVICE, "<Store GetUserInfo>", LogLevel.ERROR, (error as Error).message);
      return { resData: null, error: (error as Error).message };
    }
  }
}
