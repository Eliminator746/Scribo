import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/features/navbarSlice";
import { useLogoutMutation } from "@/features/apiSlice";
import { logout as logoutAction } from "@/features/authSlice";
import { Switch } from "@/components/ui/switch";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useAppSelector((state) => state.navbar);
  const { userInfo } = useAppSelector((state) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleThemeToggle = (checked: boolean) => {
    dispatch(setTheme(checked ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-lg font-medium transition ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-800 dark:text-gray-100"
    }`;

  return (
    <div className="sticky top-0 z-101 flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-lg dark:shadow-lg dark:shadow-black/30">
      {/* Logo */}
      <NavLink
        to="/"
        className="font-bold text-2xl tracking-wider hover:scale-110 transition"
      >
        Scribo
      </NavLink>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {userInfo && (
          <NavLink to="/profile" className={linkClasses}>
            Hi, {userInfo.username}
          </NavLink>
        )}

        {userInfo && (
          <NavLink
            to="/create"
            className="text-lg text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Create Post
          </NavLink>
        )}

        {userInfo ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-lg text-gray-800 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-400 transition disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <NavLink
            to="/login"
            className="text-lg text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Login
          </NavLink>
        )}

        <Switch
          checked={theme === "dark"}
          onCheckedChange={handleThemeToggle}
        />
      </div>
    </div>
  );
};

export default Navbar;
