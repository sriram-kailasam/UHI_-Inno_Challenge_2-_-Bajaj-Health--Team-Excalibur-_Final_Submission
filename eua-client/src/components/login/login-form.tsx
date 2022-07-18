import React from "react";
import { Button, Input } from "antd";
import "./styles.scss";
import { bfhl, nha } from "../../images";

const LoginForm = ({
    handleInputChange,
    handleLoginPress,
    isLoginActive,
    isLogging,
}: {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLoginPress: (e: React.MouseEvent<HTMLElement>) => void;
    isLoginActive: boolean;
    isLogging: boolean;
}) => {
    return (
        <div className="login-form">
            <div className="address-input-container">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "30px",
                    }}
                >
                    <img src={nha} alt="NHA" style={{ width: "154px" }} />
                    <img
                        src={bfhl}
                        alt="NHA"
                        style={{ width: "93px", marginTop: "10px" }}
                    />
                </div>
                <span className="input-label">Enter your ABHA address</span>
                <Input
                    className="address-input"
                    placeholder="mittalshyam1007@sbx"
                    onChange={handleInputChange}
                />
            </div>
            <div className="login-btn-container">
                <Button
                    className={`login-btn${isLoginActive ? "" : " disabled"}`}
                    disabled={!isLoginActive}
                    onClick={handleLoginPress}
                    loading={isLogging}
                >
                    {"LOGIN"}
                </Button>
            </div>
        </div>
    );
};

export default LoginForm;
