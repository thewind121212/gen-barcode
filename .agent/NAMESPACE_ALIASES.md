### Project namespaces: `@Ciri` and `@Jade`

This monorepo has **backend (`be`)** and **frontend (`fe`)** workspaces. Both use short **namespace imports** to avoid deep relative paths.

---

### Backend namespace: `@Ciri`

- **Where it applies**: code inside `be/core`.
- **Config**:
  - `be/tsconfig.json` → `paths: { "@Ciri/*": ["core/*"] }`
  - root `tsconfig.json` → `paths: { "@Ciri/*": ["./be/*"] }`
- **Rule**: when importing backend code from `be/core`, use `@Ciri/...` instead of `./` or `../`.
- **Exception**: keep imports to generated Prisma files (`../generated/prisma/...`) as relative paths.

---

### Frontend namespace: `@Jade`

- **Where it applies**: code inside `fe/src`.
- **Config**:
  - `fe/tsconfig.app.json` → `baseUrl: "./src"`, `paths: { "@Jade/*": ["*"] }`
  - `fe/vite.config.ts` → `resolve.alias["@Jade"] = src`.
- **Rule**: when importing frontend code from `fe/src`, use `@Jade/...` instead of `./` or `../`.
- **Exception**: library imports (e.g. `react`, `@tanstack/react-query`) stay as normal package names.

---

### Quick summary

- **Backend**: use `@Ciri/...` for internal imports in `be/core`.
- **Frontend**: use `@Jade/...` for internal imports in `fe/src`.
- **Do not change**: generated Prisma imports or third‑party library imports.