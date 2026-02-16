# Redux Store

Minimal Redux store configuration with RTK Query for API calls.

## Directory Structure

```
store/
├── store.ts              # Store configuration
└── hooks.ts              # Custom typed hooks

features/ (at src level)
├── apiSlice.ts           # RTK Query API configuration
├── navbarSlice.ts        # Navbar state (theme, sidebar, etc.)
└── [other slices]        # Add more slices as needed
```

## Quick Start

### Using State

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/features/navbarSlice";

function MyComponent() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.navbar);

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Current theme: {theme}
    </button>
  );
}
```

### Making API Calls

```typescript
import { apiSlice } from "@/features/apiSlice";

// Add endpoint in apiSlice.ts
export const apiSlice = createApi({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts/",
    }),
  }),
});

// Use in component
import { useGetPostsQuery } from "@/features/apiSlice";

function Posts() {
  const { data, isLoading, error } = useGetPostsQuery();
  // ...
}
```

## Best Practices

1. Keep Redux slices focused and minimal
2. Use RTK Query for all API calls
3. Use typed hooks for type safety
4. Store only UI state in Redux (theme, modals, etc.)
5. Let RTK Query handle server state

## Documentation

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
