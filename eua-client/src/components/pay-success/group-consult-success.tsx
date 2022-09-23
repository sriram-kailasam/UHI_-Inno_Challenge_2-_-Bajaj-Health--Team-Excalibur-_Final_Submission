import { useLocation, useNavigate } from "react-router-dom";
import { calendar2 } from "../../images";
import dayjs from "dayjs";
import { Button } from "antd";
import "./styles.scss";
import { IDoctor, ISlot } from "../search-listing/doctor-mock";
import { IUser } from "../../redux/slice/user";

export interface IPayStateGroup {
    userProfile: IUser;
    doctorProfile1: IDoctor;
    doctorProfile2: IDoctor;
    slotData: ISlot;
}

const GroupConsultSuccess = () => {
    const location = useLocation();
    const { doctorProfile1, doctorProfile2, userProfile, slotData } =
        location.state as IPayStateGroup;
    const navigate = useNavigate();

    return (
        <div className="pay-success">
            <div className="center-card">
                <img className="top-img" src={calendar2} alt="calendar-2" />
                <p className="section_1">
                    {userProfile.name?.first} , we've got you confirmed for your
                    appointment
                </p>
                <div className="section_2">
                    <span className="section_2_label">
                        {dayjs(slotData.startTime).format("hh:mm A")}
                    </span>
                    <div className="section_2_line" />
                    <span className="section_2_label">
                        {"Dr. " +
                            (doctorProfile1.name?.split("-")[1].trim() ||
                                doctorProfile1.name?.trim())}
                        {" & "}
                        {"Dr. " +
                            (doctorProfile2.name?.split("-")[1].trim() ||
                                doctorProfile2.name?.trim())}
                    </span>
                </div>
                <p className="section_3">
                    <span className="upper">
                        {dayjs(slotData.startTime).format("dddd, DD MMMM YYYY")}
                    </span>
                    <span className="lower">{"Group Consultation"}</span>
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

export default GroupConsultSuccess;
