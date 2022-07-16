import { Route, Routes } from "react-router-dom";
import Login from "modules/auth/components/login/Login";
import Dashboard from "modules/dashboard/Dashboard";
import PatientDetails from 'modules/patient-details/PatientDetails';
import RouteHspaOutlet from "./RouteHspaOutlet";
import DoctorSearch from "modules/doctor-search/DoctorSearch";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='hspa' element={<RouteHspaOutlet />}>
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patientDetails" element={<PatientDetails />} />
        <Route path="doctorSearch" element={<DoctorSearch />} />
      </Route>
    </Routes>
  )
};

export default AppRoutes;