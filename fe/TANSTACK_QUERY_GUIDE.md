# TanStack Query Integration Guide

This document explains how to use TanStack Query (React Query) in this project to fetch data from the backend API.

## 📦 Installation

TanStack Query has been installed:
```bash
npm install @tanstack/react-query
```

## 🏗️ Architecture

### 1. **API Service** (`src/services/api.ts`)
Contains the API functions that make HTTP requests to the backend.

```typescript
export const fetchProducts = async (): Promise<ProductItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/erp/getFulItemsDetail`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
```

### 2. **Custom Hook** (`src/hooks/useProducts.ts`)
Wraps the API call with TanStack Query's `useQuery` hook.

```typescript
export const useProducts = () => {
  return useQuery<ProductItem[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
```

### 3. **QueryClient Setup** (`src/App.tsx`)
The app is wrapped with `QueryClientProvider` to enable query functionality.

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

## 🚀 Usage

### Basic Usage in a Component

```typescript
import { useProducts } from '../hooks/useProducts';

const MyComponent = () => {
  const { data, isLoading, isError, error, refetch } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(product => (
        <div key={product.ItemCode}>{product.ItemName}</div>
      ))}
    </div>
  );
};
```

### Available Properties from useQuery

- `data`: The fetched data (ProductItem[] in this case)
- `isLoading`: Boolean indicating if the query is loading
- `isError`: Boolean indicating if an error occurred
- `error`: The error object if an error occurred
- `refetch`: Function to manually refetch the data
- `isFetching`: Boolean indicating if a fetch is in progress (including background refetches)
- `isSuccess`: Boolean indicating if the query was successful

## 📝 Example Component

See `src/components/generator/ProductsList.tsx` for a complete example showing:
- Loading states
- Error handling
- Data display
- Manual refetch

## 🔧 Configuration Options

### Query Options (in useQuery)

- **queryKey**: Unique identifier for the query (used for caching)
- **queryFn**: The function that fetches the data
- **staleTime**: Time before data is considered stale (5 minutes)
- **gcTime**: Time before inactive data is garbage collected (10 minutes)
- **retry**: Number of retry attempts on failure (2)
- **refetchOnWindowFocus**: Whether to refetch when window regains focus (false)

### Global Options (in QueryClient)

Set in `App.tsx` for all queries:
- **refetchOnWindowFocus**: false (don't refetch on window focus)
- **retry**: 1 (retry failed queries once)

## 🎯 Benefits

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Updates**: Data can be refetched in the background
3. **Loading States**: Built-in loading and error states
4. **Deduplication**: Multiple components using the same query share the same request
5. **Automatic Retries**: Failed requests are automatically retried
6. **Stale-While-Revalidate**: Show cached data while fetching fresh data

## 📚 Creating New Queries

To create a new query for a different endpoint:

1. **Add the API function** in `src/services/api.ts`:
```typescript
export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};
```

2. **Create a custom hook** in `src/hooks/useCategories.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
```

3. **Use it in your component**:
```typescript
const { data: categories } = useCategories();
```

## 🔗 Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools) (optional, for debugging)
