import PageWrap from "../page-wrap";
import LoginWrapper from "./login-wrapper";

const Login = () => {
    return (
        <PageWrap
            label="Login with ABHA Address"
            withBack
            onBack={() => {
                window.location.reload();
            }}
        >
            <LoginWrapper />
        </PageWrap>
    );
};

export default Login;
