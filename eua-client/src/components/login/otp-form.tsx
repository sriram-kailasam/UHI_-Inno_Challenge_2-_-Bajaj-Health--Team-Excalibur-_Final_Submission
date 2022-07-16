import { Button } from "antd";
import OtpInput from "react-otp-input";

const OtpForm = () => {
    return (
        <div className="otp-form">
            <div className="otp-input-container">
                <span className="input-label">
                    We have sent OTP on your ABHA Address xxx@sbx
                </span>
                <OtpInput
                    numInputs={6}
                    onChange={(v: number) => console.log("this is my val", v)}
                />
            </div>
            <div className="otp-submit-btn-container">
                <Button className="otp-submit-btn">{"SUBMIT"}</Button>
            </div>
        </div>
    );
};

export default OtpForm;
