import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/features/authSlice";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const sp = new URLSearchParams(location.search);
  const redirect = sp.get("redirect") || "/";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement registration API call when backend is ready
      // const res = await register(formData).unwrap();
      // dispatch(setCredentials(res));

      setError("Registration functionality coming soon");
    } catch (err: any) {
      setError(err?.data?.detail || "Registration failed. Please try again.");
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 flex justify-center">
      <div className="w-full max-w-3xl p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white my-6">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
          </span>
          <Link
            to={`/login?redirect=${redirect}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
