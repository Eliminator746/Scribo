import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NavbarState, Theme } from "./types";

const initialState: NavbarState = {
  isSidebarOpen: false,
  theme: (localStorage.getItem("theme") as Theme) || "light",
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme } =
  navbarSlice.actions;
export default navbarSlice.reducer;
