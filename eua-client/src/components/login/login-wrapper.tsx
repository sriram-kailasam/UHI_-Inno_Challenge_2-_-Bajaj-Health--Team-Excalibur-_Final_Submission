import { useLoginWrapper } from "./hooks";
import LoginForm from "./login-form";
import OtpForm from "./otp-form";

const LoginWrapper = () => {
    const {
        isOtpRequested,
        handleInputChange,
        handleLoginPress,
        isLoginActive,
        requestData,
        isLogging,
    } = useLoginWrapper();

    if (isOtpRequested) return <OtpForm requestData={requestData} />;
    return (
        <LoginForm
            handleInputChange={handleInputChange}
            handleLoginPress={handleLoginPress}
            isLoginActive={isLoginActive}
            isLogging={isLogging}
        />
    );
};

export default LoginWrapper;
