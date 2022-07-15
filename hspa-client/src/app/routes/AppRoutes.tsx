import { Route, Routes } from "react-router-dom";
import Login from "modules/auth/components/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  )
};

export default AppRoutes;