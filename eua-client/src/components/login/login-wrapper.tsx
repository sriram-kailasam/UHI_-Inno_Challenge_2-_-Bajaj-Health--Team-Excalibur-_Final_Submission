import { useLoginWrapper } from "./hooks";
import LoginForm from "./login-form";
import OtpForm from "./otp-form";

const LoginWrapper = () => {
    const {
        loginDetails: { address = "", isOtpRequested = false },
        setLoginDetails,
    } = useLoginWrapper();

    if (isOtpRequested) return <OtpForm />;
    return <LoginForm />;
};

export default LoginWrapper;
