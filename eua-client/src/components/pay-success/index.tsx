import { useLocation, useNavigate } from "react-router-dom";
import { calendar2 } from "../../images";
import { IPayState } from "../doc-profile";
import dayjs from "dayjs";
import { Button } from "antd";
import "./styles.scss";

const PaySuccess = () => {
    const location = useLocation();
    const { doctorProfile, userProfile, slotData } =
        location.state as IPayState;
    const navigate = useNavigate();

    return (
        <div className="pay-success">
            <div className="center-card">
                <img className="top-img" src={calendar2} alt="calendar-2" />
                <p className="section_1">
                    {userProfile.name?.first} , we’ve got you confirmed for your
                    appointment
                </p>
                <div className="section_2">
                    <span className="section_2_label">
                        {dayjs(slotData.startTime).format("hh:mm A")}
                    </span>
                    <div className="section_2_line" />
                    <span className="section_2_label">
                        {doctorProfile.name?.split("-")[1].trim()}
                    </span>
                </div>
                <p className="section_3">
                    <span className="upper">
                        {dayjs(slotData.startTime).format("dddd, DD MMMM YYYY")}
                    </span>
                    <span className="lower">{"Video Consultation"}</span>
                </p>
                <Button
                    className="my-app-btn"
                    onClick={() => navigate("/eua/my-appointments")}
                >
                    {"My Appointment"}
                </Button>
            </div>
        </div>
    );
};

export default PaySuccess;
