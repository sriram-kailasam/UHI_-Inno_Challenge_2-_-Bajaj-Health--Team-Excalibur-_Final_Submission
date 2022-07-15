import { Route, Routes } from "react-router-dom";
import Login from "modules/auth/components/login/Login";
import Dashboard from "modules/dashboard/Dashboard";
import RouteHspaOutlet from "./RouteHspaOutlet";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='hspa' element={<RouteHspaOutlet />}>
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
};

export default AppRoutes;