import { Navigate } from "react-router-dom";
import dayjs from "dayjs";

const NoAuthRoute = ({ children }: { children: JSX.Element }) => {
    const isLoginExpired =
        (dayjs(localStorage.getItem("last-login")).diff(dayjs(), "minutes") ||
            10) > 8;

    if (!isLoginExpired) {
        return <Navigate to="/eua" />;
    } else {
        return children;
    }
};

export default NoAuthRoute;
