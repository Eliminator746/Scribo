import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NavbarState {
  isSidebarOpen: boolean;
  theme: "light" | "dark";
}

const initialState: NavbarState = {
  isSidebarOpen: false,
  theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
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
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme } =
  navbarSlice.actions;
export default navbarSlice.reducer;
