import PageWrap from "../page-wrap";
import LoginWrapper from "./login-wrapper";

const Login = () => {
    return (
        <PageWrap
            label="Login with ABHA Address"
            withBack
            onBack={() => {
                console.log("back pressed");
            }}
        >
            <LoginWrapper />
        </PageWrap>
    );
};

export default Login;
