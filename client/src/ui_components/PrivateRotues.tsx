import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const PrivateRoutes = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const location = useLocation();

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};

export default PrivateRoutes;
