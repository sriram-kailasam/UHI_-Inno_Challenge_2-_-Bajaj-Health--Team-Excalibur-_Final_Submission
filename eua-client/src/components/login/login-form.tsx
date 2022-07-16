import { Button, Input } from "antd";
import "./styles.scss";

const LoginForm = () => {
    return (
        <div className="login-form">
            <div className="address-input-container">
                <span className="input-label">Enter your ABHA addres</span>
                <Input
                    className="address-input"
                    placeholder="mittalshyam1007@sbx"
                />
            </div>
            <div className="login-btn-container">
                <Button className="login-btn">{"LOGIN"}</Button>
            </div>
        </div>
    );
};

export default LoginForm;
