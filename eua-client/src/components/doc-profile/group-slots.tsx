import { Button } from "antd";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { femaleAvatar, maleAvatar, video } from "../../images";
import { useAppSelector } from "../../redux/hooks";
import { IUser } from "../../redux/slice/user";
import { RootState } from "../../redux/store";
import PageWrap from "../page-wrap";
import { IDoctor, ISlot, ISlots } from "../search-listing/doctor-mock";
import { getSlots } from "./api";
import Slots from "./slots";
// import { slotsMock } from "./slots-mock";

import "./styles.scss";
import { findCommonSlots } from "./utils";

export const selectProfile = (state: RootState) => state.user.profile;

export interface IPayState {
    userProfile: IUser;
    doctorProfile: IDoctor;
    slotData: ISlot;
}

interface IGroupSlots {
    doctorProfile1: IDoctor;
    doctorProfile2: IDoctor;
}

function DoctorCardMini({
    gender,
    name,
    experience,
    speciality,
    fees,
}: IDoctor) {
    return (
        <div className="card-main">
            <div className="doc-name-logo">
                <img
                    src={gender === "M" ? maleAvatar : femaleAvatar}
                    alt="Doctor Name"
                />
                <div className="doc-info-container">
                    <div className="doc-name">
                        {"Dr. " + (name?.split("-")[1].trim() || name?.trim())}
                    </div>
                    <div className="doc-info">
                        <span className="doc-spec">{speciality}</span>
                        <div className="line-vert"></div>
                        <span className="doc-exp">{experience} Yrs</span>
                    </div>
                    <div className="doc-fee-container">
                        <span className="doc-fees">₹ {fees}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const GroupSlots = () => {
    const location = useLocation();
    const { doctorProfile1, doctorProfile2 } = location.state as IGroupSlots;

    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState("");
    const isBookActive = !!selectedSlot;
    const selectedUserProfile = useAppSelector(selectProfile);

    const {
        data: { data: { slots: slotsDoc1 = [] } = {} } = {},
        isLoading: isDoc1SlotsLoading,
    } = useQuery<AxiosResponse<ISlots>, Error>(
        ["doctor-slots", doctorProfile1.hprId],
        () => getSlots(doctorProfile1.hprId),
        {
            enabled: !!doctorProfile1.hprId,
        }
    );

    const {
        data: { data: { slots: slotsDoc2 = [] } = {} } = {},
        isLoading: isDoc2SlotsLoading,
    } = useQuery<AxiosResponse<ISlots>, Error>(
        ["doctor-slots", doctorProfile2.hprId],
        () => getSlots(doctorProfile2.hprId),
        {
            enabled: !!doctorProfile2.hprId,
        }
    );

    const isLoading = isDoc1SlotsLoading || isDoc2SlotsLoading;
    const commonSlots = findCommonSlots(slotsDoc1, slotsDoc2);

    return (
        <PageWrap
            onBack={() => navigate(-1)}
            withBack
            label="Common Slots for Group Consult"
        >
            <div className="doc-profile">
                <span className="section-label-2">Primary Doctor</span>
                <DoctorCardMini {...doctorProfile1} />
                <span className="section-label-2">Secondary Doctor</span>
                <DoctorCardMini {...doctorProfile2} />
                <div style={{ marginTop: "10px" }}>
                    <span className="section-label">Consultation Type</span>
                    <Button className="e-cons-btn">
                        <img src={video} alt="video" />
                        <span>Group-Consultation</span>
                    </Button>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <span className="section-label">Date & Time</span>
                    <Slots
                        slots={commonSlots}
                        onSlotSelect={(slotId) => setSelectedSlot(slotId)}
                        selectedSlotId={selectedSlot}
                        isLoading={isLoading}
                    />
                </div>
                <div className="footer">
                    <Button
                        className={`book-btn${isBookActive ? "" : " disabled"}`}
                        onClick={() => {
                            navigate(`/eua/search-group/slots/pay`, {
                                state: {
                                    userProfile: selectedUserProfile,
                                    doctorProfile1,
                                    doctorProfile2,
                                    slotData: commonSlots?.find(
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

export default GroupSlots;
