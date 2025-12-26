# Module Establishment Guide

This guide explains how to establish a new feature module in the frontend application, following the established patterns and architecture.

## Architecture Overview

The frontend follows a modular architecture with clear separation of concerns:

- **`fe/src/core-design/`** - Reusable design system components (primitives, inputs, modals, cards, etc.)
- **`fe/src/page/`** - Entry pages (thin wrappers that compose module components)
- **`fe/src/components/<module-name>/`** - Feature modules (app-scope components organized by domain)
- **`fe/src/services/<module-name>/`** - API layer (low-level fetch calls and TanStack Query hooks)
- **`fe/src/store/`** - Global Redux store (cross-feature app state)
- **`fe/src/components/<module-name>/store.ts`** - Local Zustand store (feature-local UI state)

## State Management Strategy

### Three Types of State Containers

1. **TanStack Query** - Server state (fetching, caching, invalidation)
   - Located in: `fe/src/services/<module>/useQuery.ts`
   - Use for: API data, server-side entities, cache management

2. **Zustand (Module Local Store)** - Feature-local UI state
   - Located in: `fe/src/components/<module-name>/store.ts`
   - Use for: View mode toggles, local menu states, modal/form state within the module, temporary selections
   - **Rule**: Keep it small and UI-oriented; store **ids + UI flags**, not heavy objects

3. **Redux (Global Store)** - Cross-feature app UI state
   - Located in: `fe/src/store/`
   - Use for: Global modal stack, layout-level UI state shared across multiple pages/features, app-wide settings
   - **When to use**: State needed by multiple unrelated feature modules or the app shell

### Decision Tree: Where Should State Live?

```
Is it server data? → TanStack Query
Is it used by multiple unrelated features? → Redux
Is it only used within one feature module? → Zustand (module store)
Is it only used in one component? → React useState
```

## Step-by-Step: Creating a New Module

### Step 1: Create Module Directory Structure

Create the following structure in `fe/src/components/<module-name>/`:

```
fe/src/components/<module-name>/
├── store.ts                    # Zustand local store (if needed)
├── utils.ts                    # Module-specific utilities (optional)
├── types.ts                    # Module-specific types (optional)
├── <MainComponent>.tsx         # Main component for the module
├── <SubComponent>.tsx          # Sub-components (if needed)
└── components/                 # Nested components (optional)
    └── <NestedComponent>.tsx
```

**Example**: For a `product-module`:
```
fe/src/components/product-module/
├── store.ts
├── ProductList.tsx
├── ProductCard.tsx
├── CreateProductDialog.tsx
└── utils.ts
```

### Step 2: Create Service Layer

Create API service files in `fe/src/services/<module-name>/`:

#### 2.1 Create `api.ts` (Low-level API calls)

```typescript
// fe/src/services/product/api.ts
import Session from "supertokens-auth-react/recipe/session";
import type { ProductResponse, CreateProductRequest } from "@Jade/types/product.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildHeaders = (storeId?: string) => ({
  "Content-Type": "application/json",
  ...(storeId ? { "x-store-id": storeId } : {}),
});

export const createProduct = async (
  request: CreateProductRequest,
  storeId?: string
): Promise<CreateProductResponse> => {
  const response = await fetch(`${API_BASE_URL}/v1/product/CreateProduct`, {
    method: "POST",
    headers: buildHeaders(storeId),
    credentials: "include",
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok && data.success === false) {
    throw new Error(data.error.message);
  }

  await Session.doesSessionExist();
  return data;
};

// Add more API functions...
```

#### 2.2 Create `useQuery.ts` (TanStack Query hooks)

```typescript
// fe/src/services/product/useQuery.ts
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ProductResponse, CreateProductRequest } from "@Jade/types/product.d";
import { createProduct, getProductById } from "./api";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export const useCreateProduct = ({
  storeId,
  onSuccess,
  onError,
}: {
  storeId?: string;
  onSuccess?: (data: ApiSuccessResponse<CreateProductResponse>) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<ProductResponse, Error, CreateProductRequest>({
    mutationFn: (request: CreateProductRequest) => createProduct(request, storeId),
    onSuccess: (data) => onSuccess?.(data as unknown as ApiSuccessResponse<CreateProductResponse>),
    onError: (error) => onError?.(error),
  });
};

export const useGetProductById = (
  request: GetProductByIdRequest,
  storeId?: string,
  options?: Omit<UseQueryOptions<ApiSuccessResponse<ProductResponse>, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["product", "GetProductById", request],
    queryFn: () => getProductById(request, storeId) as unknown as ApiSuccessResponse<ProductResponse>,
    ...options,
  });
};
```

**Key Points**:
- Use stable query keys: `["module", "endpoint", request]`
- Always include `storeId` parameter for multi-tenant support
- Handle errors consistently
- Use TypeScript types from `@Jade/types/<module>.d`

### Step 3: Create Module Local Store (Zustand)

Create `store.ts` in your module directory if you need local UI state:

```typescript
// fe/src/components/product-module/store.ts
import { create } from "zustand";

export type CreateProductModalData = {
  mode: "CREATE" | "EDIT";
  productEditId: string | null;
};

const initialCreateProductModalData: CreateProductModalData = {
  mode: "CREATE",
  productEditId: null,
};

export interface ProductModuleStore {
  products: {
    createProductModalData: CreateProductModalData;
    viewMode: "grid" | "list";
    activeMenuId: string | null;
    selectedProductIds: string[];
  };
  setViewMode: (mode: "grid" | "list") => void;
  setActiveMenuId: (menuId: string | null) => void;
  setCreateProductModalData: (data: CreateProductModalData) => void;
  resetCreateProductModalData: () => void;
  toggleProductSelection: (productId: string) => void;
}

export const useProductModuleStore = create<ProductModuleStore>((set) => ({
  products: {
    createProductModalData: initialCreateProductModalData,
    viewMode: "grid",
    activeMenuId: null,
    selectedProductIds: [],
  },
  setViewMode: (mode) =>
    set((state) => ({
      products: { ...state.products, viewMode: mode },
    })),
  setActiveMenuId: (menuId) =>
    set((state) => ({
      products: { ...state.products, activeMenuId: menuId },
    })),
  setCreateProductModalData: (data) =>
    set((state) => ({
      products: { ...state.products, createProductModalData: data },
    })),
  resetCreateProductModalData: () =>
    set((state) => ({
      products: {
        ...state.products,
        createProductModalData: initialCreateProductModalData,
      },
    })),
  toggleProductSelection: (productId) =>
    set((state) => ({
      products: {
        ...state.products,
        selectedProductIds: state.products.selectedProductIds.includes(productId)
          ? state.products.selectedProductIds.filter((id) => id !== productId)
          : [...state.products.selectedProductIds, productId],
      },
    })),
}));
```

**What to Store in Module Store**:
- ✅ View mode toggles (`grid` / `list`)
- ✅ Local menu open states (`activeMenuId`)
- ✅ Modal/form state for that feature
- ✅ Temporary selections within the module
- ✅ UI flags and toggles

**What NOT to Store**:
- ❌ Server-fetched entities (use TanStack Query)
- ❌ App-wide state (use Redux)
- ❌ Heavy objects (store IDs only)

### Step 4: Create Module Components

Create your main component(s) in the module directory:

```typescript
// fe/src/components/product-module/ProductList.tsx
import { useSelector } from "react-redux";
import type { RootState } from "@Jade/store/global.store";
import { useGetProductOverview } from "@Jade/services/product/useQuery";
import { useProductModuleStore } from "./store";
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import CommonButton from "@Jade/core-design/input/CommonButton";

export const ProductList = () => {
  const appStoreInfo = useSelector((state: RootState) => state.app);
  const viewMode = useProductModuleStore((s) => s.products.viewMode);
  const setViewMode = useProductModuleStore((s) => s.setViewMode);
  const mainModal = useModal(ModalId.MAIN_PRODUCT);

  const { data: products, refetch } = useGetProductOverview(
    { storeId: appStoreInfo?.storeId || "" },
    appStoreInfo?.storeId,
    { enabled: Boolean(appStoreInfo?.storeId) }
  );

  return (
    <div className="space-y-6 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Products
        </h1>
        <CommonButton onClick={() => mainModal.open()}>
          Create Product
        </CommonButton>
      </div>
      {/* Render products... */}
    </div>
  );
};
```

**Component Guidelines**:
- Use `useSelector` to access Redux global state (e.g., `storeId` from `app` slice)
- Use module store hooks for local UI state
- Use TanStack Query hooks for server data
- Compose `core-design` components for UI primitives
- Follow dark mode patterns (see `FE_DESIGN.md`)

### Step 5: Create Entry Page

Create a thin page wrapper in `fe/src/page/`:

```typescript
// fe/src/page/Product.tsx
import ProductList from "@Jade/components/product-module/ProductList";

const Product = () => {
  return <ProductList />;
};

export default Product;
```

**Page Guidelines**:
- Keep pages thin - they should mostly compose feature components
- Handle routing params if needed
- Pass route state to components

### Step 6: Add Route (if needed)

Add the route to your router configuration (typically in `App.tsx` or router file):

```typescript
import Product from "@Jade/page/Product";

// In your routes:
<Route path="/products" element={<Product />} />
```

## Complete Example: Category Module Reference

The `category-module` serves as a reference implementation. Key files:

- **Service Layer**: `fe/src/services/category/api.ts` and `useQuery.ts`
- **Module Store**: `fe/src/components/category-module/store.ts`
- **Main Component**: `fe/src/components/category-module/MainCategory.tsx`
- **Entry Page**: `fe/src/page/Category.tsx`

Study these files to see the patterns in action.

## When to Use Redux (Global Store)

Add to Redux (`fe/src/store/`) when:

1. **Multiple unrelated features need the state**
   - Example: Modal stack (used by all modules)

2. **App shell needs the state**
   - Example: App initialization state, theme toggle

3. **Cross-feature orchestration needed**
   - Example: Global "close all modals" action

### Adding to Redux

1. Create or update a slice in `fe/src/store/<name>.store.ts`:

```typescript
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type MyGlobalState = {
  value: string;
};

const initialState: MyGlobalState = {
  value: '',
};

export const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = mySlice.actions;
export const myReducer = mySlice.reducer;
```

2. Add to `fe/src/store/global.store.ts`:

```typescript
import { myReducer } from '@Jade/store/my.store';

export const store = configureStore({
  reducer: {
    app: appReducer,
    modal: modalReducer,
    myFeature: myReducer, // Add here
  },
});
```

3. Use in components:

```typescript
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@Jade/store/global.store';
import { setValue } from '@Jade/store/my.store';

const MyComponent = () => {
  const value = useSelector((state: RootState) => state.myFeature.value);
  const dispatch = useDispatch();
  
  return <button onClick={() => dispatch(setValue('new'))}>{value}</button>;
};
```

## Checklist for New Module

- [ ] Created module directory in `fe/src/components/<module-name>/`
- [ ] Created service layer (`api.ts` and `useQuery.ts`) in `fe/src/services/<module-name>/`
- [ ] Created module store (`store.ts`) if local UI state is needed
- [ ] Created main component(s) following design system patterns
- [ ] Created entry page in `fe/src/page/`
- [ ] Added route configuration (if needed)
- [ ] Used TanStack Query for server state
- [ ] Used Zustand for module-local UI state
- [ ] Used Redux only for cross-feature state (if needed)
- [ ] Followed dark mode patterns
- [ ] Used `core-design` components for primitives
- [ ] Added TypeScript types in `fe/src/types/<module>.d.ts` (if needed)

## Common Patterns

### Accessing Store ID (Multi-tenant)

```typescript
import { useSelector } from "react-redux";
import type { RootState } from "@Jade/store/global.store";

const MyComponent = () => {
  const appStoreInfo = useSelector((state: RootState) => state.app);
  const storeId = appStoreInfo?.storeId;
  
  // Use storeId in API calls
  const { data } = useGetData({ storeId }, storeId, { enabled: Boolean(storeId) });
};
```

### Using Modals

```typescript
import { ModalId, useModal } from "@Jade/core-design/modal/useModal";
import { ConfirmModal } from "@Jade/core-design/modal/ConfirmModal";

const MyComponent = () => {
  const confirmModal = useModal(ModalId.CONFIRM);
  
  return (
    <>
      <button onClick={() => confirmModal.open()}>Open</button>
      <ConfirmModal
        modal={confirmModal}
        title="Confirm"
        onConfirm={() => { /* ... */ }}
      />
    </>
  );
};
```

### Error Handling with Toasts

```typescript
import toast from "react-hot-toast";

const { mutate, isPending } = useCreateProduct({
  storeId,
  onSuccess: () => {
    toast.success("Product created successfully");
    refetch();
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

## Summary

- **Module Structure**: `fe/src/components/<module-name>/` with components, store, and utils
- **Service Layer**: `fe/src/services/<module-name>/` with API calls and TanStack Query hooks
- **State Management**:
  - **TanStack Query**: Server state
  - **Zustand (module store)**: Feature-local UI state
  - **Redux**: Cross-feature global state
- **Pages**: Thin wrappers in `fe/src/page/` that compose module components
- **Design System**: Use `core-design/` components for reusable primitives

Follow these patterns to maintain consistency and scalability across the application.

