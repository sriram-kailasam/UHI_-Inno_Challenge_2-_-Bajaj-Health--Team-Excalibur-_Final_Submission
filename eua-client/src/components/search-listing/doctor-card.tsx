import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { femaleAvatar, maleAvatar } from "../../images";
import { IDoctor } from "./doctor-mock";
import dayjs from "dayjs";
import { IMyApp } from "../my-app/mock";

const DoctorCard = (docProps: IDoctor & { isMyApp: boolean } & IMyApp) => {
    const {
        name,
        speciality,
        experience,
        fees,
        gender,
        hprId,
        isMyApp = false,
        slots,
        appointmentStatus = "Failed",
    } = docProps || {};
    const navigate = useNavigate();
    return (
        <div className="doctor-card">
            <div className="card-main">
                {isMyApp && (
                    <div className="top-row">
                        <div className="next-slot">
                            {`Appointment at ${dayjs(
                                slots?.[0].startTime
                            ).format("hh:mm A")}`}
                        </div>
                        {/* <div className="doc-id">#2378A</div> */}
                    </div>
                )}
                <div className={`doc-name-logo${isMyApp ? " is-my-app" : ""}`}>
                    <img
                        src={gender === "M" ? maleAvatar : femaleAvatar}
                        alt="Doctor Name"
                    />
                    <div className="doc-info-container">
                        <div className="doc-name">
                            {name?.split("-")[1]?.trim()}
                        </div>
                        <div className="doc-info">
                            <span className="doc-spec">{speciality}</span>
                            <div className="line-vert"></div>
                            <span className="doc-exp">{experience} Yrs</span>
                        </div>
                        {!isMyApp && (
                            <div className="doc-fee-container">
                                <span className="doc-fees">₹ {fees}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="footer">
                {isMyApp && (
                    <Button
                        className="know-more-btn"
                        onClick={() => {
                            // we can init call here
                        }}
                    >
                        <span>Know More</span>
                    </Button>
                )}
                <Button
                    className={`book-apt-btn${
                        isMyApp
                            ? ` is-my-app${
                                  appointmentStatus === "Failed"
                                      ? " failed"
                                      : " success"
                              }`
                            : ""
                    }`}
                    onClick={() =>
                        navigate(`/eua/search/${hprId}`, {
                            state: docProps,
                        })
                    }
                    disabled={isMyApp}
                    style={{ width: "100%" }}
                >
                    <span>
                        {isMyApp
                            ? `${
                                  appointmentStatus === "Failed"
                                      ? "Appointment canceled"
                                      : "Appointment booked"
                              }`
                            : `Book Appointment`}
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default DoctorCard;
