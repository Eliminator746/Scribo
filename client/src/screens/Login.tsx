import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation, useGetCurrentUserQuery } from "@/features/apiSlice";
import { setCredentials } from "@/features/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: currentUser } = useGetCurrentUserQuery();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Login with email and password
      const loginResult = await login(formData).unwrap();
      console.log("Login successful:", loginResult);

      // If login successful and we have user data from the query, store credentials
      if (currentUser) {
        dispatch(setCredentials(currentUser));
        navigate("/");
      }
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {typeof error === "string"
              ? error
              : "detail" in error
                ? (error as any).detail
                : "Login failed. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your email"
              required
              disabled={isLoading}
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
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 bg-gray-800 text-white font-semibold rounded cursor-pointer hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm text-gray-600">New Customer?</span>
          <Link
            to="/register"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
