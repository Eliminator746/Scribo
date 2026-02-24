import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/features/navbarSlice";
import { useLogoutMutation } from "@/features/apiSlice";
import { logout as logoutAction } from "@/features/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useAppSelector((state) => state.navbar);
  const { userInfo } = useAppSelector((state) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
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

  return (
    <div className="sticky top-0 z-101 flex justify-between items-center py-4 px-6 bg-white bg-opacity-80 backdrop-blur-md text-gray-800 shadow-lg">
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
          <span className="text-lg font-medium">Hi, {userInfo.username}</span>
        )}

        {userInfo && (
          <NavLink
            to="/create"
            className="text-lg hover:text-blue-600 transition"
          >
            Create Post
          </NavLink>
        )}

        {userInfo ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-lg hover:text-red-500 transition disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <NavLink
            to="/login"
            className="text-lg hover:text-blue-600 transition"
          >
            Login
          </NavLink>
        )}

        <button
          onClick={handleThemeToggle}
          className="text-lg hover:text-yellow-500 transition"
          title={`Current theme: ${theme}`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
