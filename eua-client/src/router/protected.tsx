import { Navigate } from "react-router-dom";
import { IUser } from "../redux/slice/user";
import dayjs from "dayjs";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const loginItems = JSON.parse(
        localStorage.getItem("user-profile") || "{}"
    ) as IUser;

    const isLoginExpired =
        (dayjs().diff(dayjs(localStorage.getItem("last-login")), "minutes") ||
            10) > 12000;

    if (
        loginItems.id &&
        loginItems.healthId &&
        loginItems.name?.first &&
        !isLoginExpired
    ) {
        return children;
    } else {
        return <Navigate to="/eua/login" />;
    }
};

export default ProtectedRoute;
