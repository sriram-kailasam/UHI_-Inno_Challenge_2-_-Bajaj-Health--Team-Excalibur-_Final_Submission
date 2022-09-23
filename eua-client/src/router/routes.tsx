import { DoctorSearch, EuaHome } from "../components";
import AppointmentPay from "../components/app-pay";
import GroupConsultPay from "../components/app-pay/group-consult-pay";
import DocProfile from "../components/doc-profile";
import GroupSlots from "../components/doc-profile/group-slots";
import MyAppointments from "../components/my-app";
import PaySuccess from "../components/pay-success";
import GroupConsultSuccess from "../components/pay-success/group-consult-success";
import DoctorSearchGroup from "../components/search-group";
import GroupVideoCall from "../components/tele-consult/components/group-video-call";
import VideoCall from "../components/tele-consult/components/video-call";

export const routes = [
    {
        element: <EuaHome />,
        isIndex: true,
    },
    {
        element: <DoctorSearch />,
        path: "search",
    },
    {
        element: <DoctorSearchGroup />,
        path: "search-group",
    },
    {
        element: <DocProfile />,
        path: "search/:docHprId",
    },
    {
        element: <GroupSlots />,
        path: "search-group/slots",
    },
    {
        element: <AppointmentPay />,
        path: "search/:docHprId/pay",
    },
    {
        element: <GroupConsultPay />,
        path: "search-group/slots/pay",
    },
    {
        element: <PaySuccess />,
        path: "search/:docHprId/pay-success",
    },
    {
        element: <GroupConsultSuccess />,
        path: "search-group/pay-success",
    },
    {
        element: <MyAppointments />,
        path: "my-appointments",
    },
    {
        element: <VideoCall />,
        path: "video-call",
    },
    {
        element: <GroupVideoCall />,
        path: "group-video-call",
    },
    {
        // fallback route
        path: "*",
        element: <EuaHome />,
    },
];
