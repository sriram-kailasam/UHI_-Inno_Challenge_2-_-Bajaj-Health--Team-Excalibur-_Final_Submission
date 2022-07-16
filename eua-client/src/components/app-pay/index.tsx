import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
    calendar,
    femaleAvatar,
    maleAvatar,
    profile,
    videoOutline,
} from "../../images";
import { IPayState } from "../doc-profile";
import PageWrap from "../page-wrap";
import "./styles.scss";
import { Button } from "antd";

const AppointmentPay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { doctorProfile, userProfile, slotData } =
        location.state as IPayState;

    return (
        <PageWrap onBack={() => navigate(-1)} withBack label="">
            <div className="app-pay">
                <div className="card-main">
                    <div className="doc-name-logo">
                        <img
                            src={
                                doctorProfile.gender === "M"
                                    ? maleAvatar
                                    : femaleAvatar
                            }
                            alt="Doctor Name"
                        />
                        <div className="doc-info-container">
                            <div className="doc-name">
                                {doctorProfile.name?.split("-")[1].trim()}
                            </div>
                            <div className="doc-info">
                                <span className="doc-spec">
                                    {doctorProfile.speciality}
                                </span>
                                <div className="line-vert"></div>
                                <span className="doc-exp">
                                    {doctorProfile.experience} Yrs
                                </span>
                            </div>
                            <div className="doc-fee-container">
                                <span className="doc-fees">
                                    ₹ {doctorProfile.fees}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="app-body">
                    <header>Appointment Details</header>
                    <div className="section">
                        <div className="section-img">
                            <img src={profile} alt="profile" />
                        </div>
                        <div className="section-right">
                            <span className="item-top">{`${userProfile.name?.first} ${userProfile.name?.middle} ${userProfile.name?.last}`}</span>
                            <span className="item-two">
                                {userProfile.gender === "M" ? "Male" : "Female"}
                            </span>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-img">
                            <img src={calendar} alt="calendar" />
                        </div>
                        <div className="section-right">
                            <span className="item-top">
                                {dayjs(slotData.startTime).format("hh:mm A")}
                            </span>
                            <span className="item-two">
                                {dayjs(slotData.startTime).format(
                                    "dddd, DD MMMM YYYY"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-img">
                            <img src={videoOutline} alt="video-outline" />
                        </div>
                        <div className="section-right">
                            <span>{"Video Consultation"}</span>
                        </div>
                    </div>
                </div>

                <div className="pay-footer">
                    <span className="total-fee">Total Fee</span>
                    <Button className="pay-btn">
                        Pay ₹ {doctorProfile.fees}
                    </Button>
                </div>
            </div>
        </PageWrap>
    );
};

export default AppointmentPay;
