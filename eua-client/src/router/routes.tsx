import { EuaHome } from "../components";
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
        // fallback route
        path: "*",
        element: <EuaHome />,
    },
];
