import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLoginMutation } from "@/features/apiSlice";
import { setCredentials } from "@/features/authSlice";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const sp = new URLSearchParams(location.search);
  const redirect = sp.get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login(formData).unwrap();

      dispatch(setCredentials(res));
      // DO NOT navigate here
      // Let useEffect handle redirect
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="w-full max-w-3xl p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 my-6">
          Sign In
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition disabled:bg-gray-400"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm text-gray-600">New Customer?</span>
          <Link
            to={`/register?redirect=${redirect}`}
            className="text-sm font-medium text-blue-600"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
