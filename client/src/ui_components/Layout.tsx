import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.js";

const Layout = () => {
  const { theme } = useAppSelector((state) => state.navbar);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
