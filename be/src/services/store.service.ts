import { StoreRepository } from "../repo/store.repo.js";
import { StoreMemberRepository } from "../repo/storeMember.repo.js";
import { StorageRepository } from "../repo/storage.repo.js";
import { StoreRole } from "../../generated/prisma/enums.js";

export class StoreService {
    private storeRepo: StoreRepository;
    private storeMemberRepo: StoreMemberRepository;
    private storageRepo: StorageRepository;

    constructor() {
        this.storeRepo = new StoreRepository();
        this.storeMemberRepo = new StoreMemberRepository();
        this.storageRepo = new StorageRepository();
    }

    async createStore(userId: string, name: string) {
        // 1. Create Store
        const store = await this.storeRepo.create({
            name,
        });

        // 2. Add User as Owner
        await this.storeMemberRepo.create({
            userId,
            store: { connect: { id: store.id } },
            role: StoreRole.OWNER,
        });

        // 3. Create Storage for Store
        await this.storageRepo.create({
            store: { connect: { id: store.id } },
            location: "Default Location", // You might want to parameterize this later
            capacity: 100, // Default capacity
        });

        return store;
    }
}
