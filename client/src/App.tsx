import { useAppSelector } from "@/store/hooks";
import DetailPage from "./screens/Detail";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Register from "./screens/Register";
import PrivateRoutes from "./ui_components/PrivateRotues";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./ui_components/Layout";

function App() {
  const { userInfo } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:slug" element={<DetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
