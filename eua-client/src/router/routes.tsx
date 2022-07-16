import { DoctorSearch, EuaHome } from "../components";
import Login from "../components/login";
import VideoCall from "../components/tele-consult/components/video-call";

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
        element: <VideoCall />,
        path: 'video-call',
    },
    {
        // fallback route
        path: "*",
        element: <EuaHome />,
    },
];
