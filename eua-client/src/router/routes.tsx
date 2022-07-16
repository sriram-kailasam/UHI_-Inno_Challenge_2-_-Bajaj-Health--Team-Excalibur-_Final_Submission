import { DoctorSearch, EuaHome } from "../components";
import Login from "../components/login";

export const routes = [
    {
        element: <EuaHome />,
        isIndex: true,
    },
    {
        element: <Login />,
        path: "login",
    },
    {
        element: <DoctorSearch />,
        path: "search",
    },
    {
        // fallback route
        path: "*",
        element: <EuaHome />,
    },
];
