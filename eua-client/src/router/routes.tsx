import { DoctorSearch, EuaHome } from "../components";
import AppointmentPay from "../components/app-pay";
import DocProfile from "../components/doc-profile";
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
        element: <DocProfile />,
        path: "search/:docHprId",
    },
    {
        element: <AppointmentPay />,
        path: "search/:docHprId/pay",
    },
    {
        element: <></>,
        path: "search/:docHprId/pay-success",
    },
    {
        element: <VideoCall />,
        path: "video-call",
    },
    {
        // fallback route
        path: "*",
        element: <EuaHome />,
    },
];
