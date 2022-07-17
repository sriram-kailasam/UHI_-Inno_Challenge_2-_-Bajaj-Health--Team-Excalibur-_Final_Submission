import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { femaleAvatar, maleAvatar, video } from "../../images";
import dayjs from "dayjs";
import { IBookPayload } from "../app-pay/apis";
import { useAppSelector } from "../../redux/hooks";
import { selectProfile } from "../doc-profile";

const DoctorCard2 = (docProps: IBookPayload) => {
    const {
        doctor: { name, gender },
    } = docProps || {};
    const navigate = useNavigate();
    const isAppointmentCancelled = dayjs(docProps.startTime).isBefore(
        dayjs(),
        "minutes"
    );
    const selectedUserProfile = useAppSelector(selectProfile);

    const receivers = [docProps.hprId];
    if (docProps.isGroupConsult && docProps.groupConsult?.hprId) {
        receivers.push(docProps.groupConsult.hprId);
    }

    return (
        <div className="doctor-card">
            <div className="card-main">
                {
                    <div className="top-row">
                        <div className="next-slot">
                            {`Appointment at ${dayjs(docProps.startTime).format(
                                "hh:mm A"
                            )}`}
                        </div>
                        {/* <div className="doc-id">#2378A</div> */}
                    </div>
                }
                <div className={`doc-name-logo is-my-app`}>
                    <img
                        src={gender === "M" ? maleAvatar : femaleAvatar}
                        alt="Doctor Name"
                    />
                    <div className="doc-info-container">
                        <div className="doc-name">
                            {"Dr. " +
                                (name?.split("-")[1]?.trim() || name?.trim())}
                        </div>
                        <div className="doc-info" style={{ marginTop: "5px" }}>
                            <span className="doc-spec">
                                {dayjs(docProps.startTime).format(
                                    "DD/MMM/YYYY"
                                )}
                            </span>
                            <div className="line-vert"></div>
                            <span className="doc-exp">
                                {dayjs(docProps.startTime).format("hh:mm A")}
                            </span>
                        </div>
                        <div className="e-consssss">
                            <Button className="e-cons-btn">
                                <img src={video} alt="video" />
                                <span>
                                    {docProps.isGroupConsult
                                        ? "Group Consultaion"
                                        : "Tele Consultation"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                {
                    <Button
                        className="know-more-btn"
                        onClick={() => {
                            navigate("/eua/video-call", {
                                state: {
                                    clientId: selectedUserProfile.id,
                                    receiverIds: receivers,
                                },
                            });
                        }}
                    >
                        <span>Join Call</span>
                    </Button>
                }
                <Button
                    className={`book-apt-btn${` is-my-app${
                        isAppointmentCancelled ? " failed" : " success"
                    }`}`}
                    onClick={() =>
                        navigate(`/eua/search/${docProps.hprId}`, {
                            state: docProps,
                        })
                    }
                    disabled
                    style={{ width: "100%" }}
                >
                    <span>
                        {`${
                            isAppointmentCancelled
                                ? "Appointment canceled"
                                : "Appointment booked"
                        }`}
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default DoctorCard2;
