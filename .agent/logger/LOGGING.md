## Logging & Create Store API

This document explains how logging is structured in the backend (`be`) and how it is applied to the `createStore` API.

---

### Logging architecture

- **Logger implementation**: Logging is implemented using `pino` with the `pino-pretty` transport for readable console output (see `src/utils/logger.ts`).
- **Initialization**: The logger is initialized once in `src/index.ts` via `InitPinoLogger()`. If it has not been initialized yet, both helpers (`GeneralLogger`, `UnitLogger`) will lazily call `InitPinoLogger()`.
- **Environment-aware debug**: `DEBUG` logs are only shown when `ENVIRONMENT=dev` (see `env.ENVIRONMENT`). In other environments, debug logs are skipped.

---

### Logger helpers

- **Log types (`LogType`)**: Used to prefix log messages by layer.
  - **INFRASTRUCTURE**: for infrastructure concerns like Prisma, connection pools, etc.
  - **REPO**: for repository/database access (`src/repo/*`).
  - **SERVICE**: for domain/application logic (`src/services/*`).
  - **ROUTER**: for HTTP routing and controllers (`src/api/*`).

- **Log levels (`LogLevel`)**:
  - **INFO**: normal operational events (start/stop, successful actions).
  - **ERROR**: failures and exceptions.
  - **WARN**: non-fatal suspicious situations.
  - **DEBUG**: verbose diagnostic logs (only in `dev`).
  - **FATAL**: unrecoverable errors.

- **General logger (`GeneralLogger`)**

  Use this for cross-cutting or infrastructure logs (server start, Prisma lifecycle, etc.):

  ```ts
  GeneralLogger(LogType.INFRASTRUCTURE, LogLevel.INFO, "First Initializing Prisma Client");
  ```

- **Unit logger (`UnitLogger`)**

  Use this for logs scoped to a specific unit (router, service, repository). It prefixes the message with both the unit type and name:

  ```ts
  UnitLogger(LogType.ROUTER, "Store Create", LogLevel.ERROR, error.message);
  ```

  Recommended **unit names**:
  - **Router**: `StoreRouter.createStore`, `AuthRouter.login`, etc.
  - **Service**: `StoreService.createStore`, `UserService.updateProfile`, etc.
  - **Repository**: `StoreRepository.create`, `StoreMemberRepository.findByStoreId`, etc.

---

### Logging in routing layer (`src/api/*`)

- **Goal**: capture request-level events and failures.
- **Recommended pattern**:
  - Log **DEBUG/INFO** when the handler starts (optional, especially for complex handlers).
  - Log **ERROR** in the `catch` block before delegating to the global error handler.

Example (simplified from `src/api/store/store.routes.ts`):

```ts
router.post("/createStore", async (req, res, next) => {
  try {
    const session = await Session.getSession(req, res);
    const userId = session.getUserId();
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Store name is required" });
      return;
    }

    const store = await storeService.createStore(userId, name);
    res.status(201).json(store);
  } catch (error) {
    UnitLogger(
      LogType.ROUTER,
      "StoreRouter.createStore",
      LogLevel.ERROR,
      (error as Error).message,
    );
    next(error);
  }
});
```

---

### Logging in service layer (`src/services/*`)

- **Goal**: describe business operations and orchestration across repositories.
- **When to log**:
  - At the start of important operations (INFO/DEBUG), especially those that touch multiple repos or external systems.
  - On business rule failures or unexpected states (WARN/ERROR).

Example pattern for `StoreService.createStore`:

```ts
import { UnitLogger, LogType, LogLevel } from "../utils/logger";

export class StoreService {
  // ... ctor omitted

  async createStore(userId: string, name: string) {
    UnitLogger(
      LogType.SERVICE,
      "StoreService.createStore",
      LogLevel.INFO,
      `Creating store for userId=${userId}`,
    );

    const store = await this.storeRepo.create({ name });

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

    UnitLogger(
      LogType.SERVICE,
      "StoreService.createStore",
      LogLevel.INFO,
      `Store created id=${store.id}`,
    );

    return store;
  }
}
```

---

### Logging in repository layer (`src/repo/*`)

- **Goal**: track database access and failures without flooding logs.
- **Recommended pattern**:
  - Optionally log **DEBUG** when executing complex queries.
  - Log **ERROR** when a database operation fails (e.g. constraint violations, unexpected nulls), usually inside a `try/catch` in the service, or in the repo if you explicitly handle DB-specific errors.

Example pattern:

```ts
import { UnitLogger, LogType, LogLevel } from "../utils/logger";

export class StoreRepository {
  async create(data: Prisma.StoreCreateInput) {
    UnitLogger(LogType.REPO, "StoreRepository.create", LogLevel.DEBUG, "Creating store");
    return prisma.store.create({ data });
  }
}
```

---

## Create Store API

This backend currently exposes a single store-related API for creating a store.

### Endpoint

- **Method**: `POST`
- **Path**: `/api/v1/store/createStore`
- **Auth**: requires a valid SuperTokens session (`Session.getSession`).

### Request

- **Body** (JSON):
  - **name**: `string` – required. The human-readable store name.

Example:

```json
{
  "name": "Main Warehouse"
}
```

### Responses

- **201 Created**
  - Returns the newly created store record from Prisma.
- **400 Bad Request**
  - When `name` is missing:
  - Body: `{ "message": "Store name is required" }`.
- **401 Unauthorized**
  - When the SuperTokens session is missing or invalid.
- **5xx**
  - Unhandled errors are passed to the global `errorHandler`, which returns a JSON error structure with `message` and, in non-production environments, the error `stack`.

### Flow

1. **Router** (`POST /api/v1/store/createStore`):
   - Reads the authenticated `userId` from the session.
   - Validates the `name` field.
   - Delegates to `StoreService.createStore(userId, name)`.
   - On error, logs with `UnitLogger(LogType.ROUTER, "StoreRouter.createStore", LogLevel.ERROR, error.message)` and forwards to the error middleware.
2. **Service** (`StoreService.createStore`):
   - Creates a new `Store`.
   - Adds the requesting user as an `OWNER` in `StoreMember`.
   - Creates a default `Storage` record for the store.
3. **Repositories** (`StoreRepository`, `StoreMemberRepository`, `StorageRepository`):
   - Perform the actual Prisma DB operations. Optional `UnitLogger` calls can be added as needed for deeper tracing.

This setup ensures that routing, service, and repository layers can all emit structured logs with clear prefixes and consistent levels, while the `createStore` API remains the single, well-defined entry point for creating a store.
