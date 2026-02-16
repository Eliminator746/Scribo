import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout } from "@/features/authSlice";

/**
 * Example: Using Auth Slice
 *
 * The auth slice stores user information in Redux and automatically
 * persists it to localStorage.
 */

// Example 1: Login and store user credentials
export function LoginExample() {
  const dispatch = useAppDispatch();

  const handleLogin = (userData: any) => {
    // After API login, store user info
    dispatch(
      setCredentials({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        token: userData.token, // Bearer token for API requests
      }),
    );
  };

  return (
    <button
      onClick={() =>
        handleLogin({
          id: "1",
          username: "john",
          email: "john@example.com",
          token: "abc123",
        })
      }
    >
      Login
    </button>
  );
}

// Example 2: Access user info in component
export function UserProfile() {
  const { userInfo } = useAppSelector((state) => state.auth);

  if (!userInfo) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {userInfo.username}</h1>
      <p>Email: {userInfo.email}</p>
    </div>
  );
}

// Example 3: Logout
export function LogoutExample() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // userInfo is cleared and localStorage is updated
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// Example 4: Protected route - check if user is logged in
export function ProtectedComponent() {
  const { userInfo } = useAppSelector((state) => state.auth);

  if (!userInfo) {
    return <div>Please login first</div>;
  }

  return <div>Protected content for {userInfo.username}</div>;
}
