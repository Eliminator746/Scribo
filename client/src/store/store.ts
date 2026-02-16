import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "@/features/navbarSlice";
import authReducer from "@/features/authSlice";
import { apiSlice } from "@/features/apiSlice";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
