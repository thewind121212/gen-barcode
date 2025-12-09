## Frontend design overview

The frontend is a React SPA that uses SuperTokens for authentication, React Router for navigation, and TanStack Query for all server data access. The main entry point is `App.tsx`, which wires together auth, routing, and the shared React Query client.

### Core building blocks

- **Authentication**
  - Handled by `supertokens-auth-react` with the `EmailPassword` and `Session` recipes.
  - `App.tsx` wraps the app with `SuperTokensWrapper` and configures `appInfo` and auth routes.
  - `ProtectedLayout` wraps protected routes in `SessionAuth` so only authenticated users can access them.

- **Routing & layout**
  - Uses `react-router-dom` with a top-level `BrowserRouter` and `Routes` defined in `App.tsx`.
  - `ProtectedLayout` contains:
    - A shared `QueryClientProvider` for TanStack Query.
    - A global `Toaster` from `react-hot-toast` for notifications.
    - The `Sidebar` navigation (hidden on onboarding-like routes when needed).
    - An `Outlet` where feature pages like `Generator` and `OnboardingComponent` render.

- **Data fetching and server state (TanStack Query)**
  - A single `QueryClient` is created in `App.tsx` and shared across the app via `QueryClientProvider`.
  - Query behavior defaults:
    - `refetchOnWindowFocus: false` (no automatic refetch on focus).
    - `retry: 1` (one retry for failed requests).
  - Feature-specific hooks (for example `useProducts`, `useSuppliers`, `useCreateStore`) are built on top of TanStack Query and live in `hooks/` or feature-specific service folders.

### Service layer pattern

The frontend uses a simple service-layer pattern for each backend module:

- **`fe/src/services/store/api.ts`**
  - Contains low-level `fetch` calls to the backend REST API.
  - Keeps API base URL and endpoints in one place.
  - Handles HTTP status checking and throws typed `Error` objects when requests fail.
  - Uses `Session.doesSessionExist()` where needed to keep SuperTokens session and cookies in sync.
  - Example responsibilities:
    - `fetchProducts` / `fetchSuppliers` for ERP endpoints.
    - `createStore` for the `/store/createStore` endpoint.

- **`fe/src/services/store/useQuery.ts`**
  - Wraps the raw API functions with TanStack Query hooks.
  - Keeps query keys, caching configuration, and invalidation logic in one place.
  - Example hooks:
    - `useProducts` → `fetchProducts` with sensible `staleTime`, `gcTime`, and retry settings.
    - `useSuppliers` → `fetchSuppliers` with similar options.
    - `useCreateStore` → `createStore` mutation that invalidates the `['stores']` query key on success.


### How components use data

- Components never call `fetch` directly.
- Instead, they:
  - Import a hook from `hooks/` (for example `useProducts` or `useSuppliers`).
  - Use the TanStack Query result (`data`, `isLoading`, `isError`, etc.) to render UI.
  - For mutations (like creating a store), they call the `mutate` function from hooks such as `useCreateStore` and react to status flags (`isPending`, `isSuccess`, `isError`).

### Adding a new backend module to the frontend

When a new backend feature is added (for example, a `store` module), the frontend follows this pattern:

1. **Add API functions** in `fe/src/services/<module>/api.ts`:
   - Export strongly typed functions that call the backend route(s).
   - Handle HTTP errors and type the return values.
2. **Add query/mutation hooks** in `fe/src/services/<module>/useQuery.ts`:
   - Use `useQuery` for reads and `useMutation` for writes.
   - Define stable query keys and invalidate them in `onSuccess` handlers for mutations.
3. **Expose high-level hooks** in `fe/src/hooks` if the feature is shared across multiple components.
4. **Use the hooks in UI components** instead of talking to the API directly.

This keeps the frontend modular, keeps API concerns in one place, and makes the UI easy to test and evolve as backend modules grow.