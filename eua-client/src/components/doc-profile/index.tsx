import { Button } from "antd";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { femaleAvatar, maleAvatar, video } from "../../images";
import { useAppSelector } from "../../redux/hooks";
import { IUser } from "../../redux/slice/user";
import { RootState } from "../../redux/store";
import PageWrap from "../page-wrap";
import { IDoctor, ISlot } from "../search-listing/doctor-mock";
import Slots from "./slots";
import { slotsMock } from "./slots-mock";

import "./styles.scss";

export const selectProfile = (state: RootState) => state.user.profile;

export interface IPayState {
    userProfile: IUser;
    doctorProfile: IDoctor;
    slotData: ISlot;
}

const DocProfile = () => {
    const { docHprId = "" } = useParams();
    const location = useLocation();
    const doctorProfile = location.state as IDoctor;
    const { name, gender, speciality, experience, fees } = doctorProfile;

    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState("");

    const isBookActive = !!selectedSlot;

    const selectedUserProfile = useAppSelector(selectProfile);

    return (
        <PageWrap onBack={() => navigate(-1)} withBack label="">
            <div className="doc-profile">
                <div className="card-main">
                    <div className="doc-name-logo">
                        <img
                            src={gender === "M" ? maleAvatar : femaleAvatar}
                            alt="Doctor Name"
                        />
                        <div className="doc-info-container">
                            <div className="doc-name">
                                {name?.split("-")[1].trim()}
                            </div>
                            <div className="doc-info">
                                <span className="doc-spec">{speciality}</span>
                                <div className="line-vert"></div>
                                <span className="doc-exp">
                                    {experience} Yrs
                                </span>
                            </div>
                            <div className="doc-fee-container">
                                <span className="doc-fees">₹ {fees}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <span className="section-label">Consultation Type</span>
                    <Button className="e-cons-btn">
                        <img src={video} alt="video" />
                        <span>E-Consultation</span>
                    </Button>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <span className="section-label">Date & Time</span>
                    <Slots
                        slots={slotsMock}
                        onSlotSelect={(slotId) => setSelectedSlot(slotId)}
                        selectedSlotId={selectedSlot}
                    />
                </div>
                <div className="footer">
                    <Button
                        className={`book-btn${isBookActive ? "" : " disabled"}`}
                        onClick={() => {
                            navigate(`/eua/search/${docHprId}/pay`, {
                                state: {
                                    userProfile: selectedUserProfile,
                                    doctorProfile,
                                    slotData: slotsMock.find(
                                        (eachSlot) =>
                                            eachSlot.slotId === selectedSlot
                                    ),
                                },
                            });
                        }}
                    >
                        Book Appointment
                    </Button>
                </div>
            </div>
        </PageWrap>
    );
};

export default DocProfile;
