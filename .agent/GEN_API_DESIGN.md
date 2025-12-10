## API Generator Design (overview)

Purpose: single source of truth in proto → regenerate FE/BE scaffolding consistently.

### Flow
1) Input: `bff/<pkg>/<pkg>.proto` with `service` + `google.api.http` annotations (post/get).
2) Run: `npm run gen -- <pkg> [--test]`.
3) Steps:
   - Load proto → extract messages and RPCs.
   - `gen-types.ts`: emit shared TS interfaces into `fe/src/types` and `be/types`.
   - `gen-api.ts`: emit FE/BE code (routes/hooks/api/DTO skeletons).
4) Output root:
   - Normal: repo root.
   - Test mode: `./temp` (mirrors structure).

### File outputs (per package)
- FE API: `fe/src/services/<pkg>/api.ts` (fetch wrappers).
- FE Hooks: `fe/src/services/<pkg>/useQuery.ts` (React Query hooks; imports only needed hooks).
- BE Routes: `be/core/api/<pkg>/<pkg>.routes.ts` (Express routes wired to service).
- BE DTO: `be/core/dto/<pkg>.dto.ts` (created once; never overwritten).
- Types: `fe/src/types/<pkg>.d.ts`, `be/types/<pkg>.d.ts`.

### HTTP handling
- Supported verbs: post/get (from `google.api.http`). Default is POST if unspecified.
- POST: JSON body, credentials included, 201 status in routes.
- GET: query params, 200 status in routes.

### Safety/overwrites
- FE API/hooks/routes always regenerated (proto is source of truth).
- DTO file: written only if missing—manual validation preserved.
- Types: regenerated with content replacement between dividers (keeps header).

### Hooks import rules
- Detects presence of GET → import `useQuery`.
- Detects any non-GET → import `useMutation`.
- Avoids unused imports to satisfy lint.

### Directory rules
- Generator creates missing dirs before writing.
- Path resolution based on proto location; `--test` rewrites root to `./temp`.

### Extending
- To add PUT/PATCH/DELETE: extend `httpMethod` union, map `google.api.http` fields, adjust FE/BE writers similarly to POST logic.

