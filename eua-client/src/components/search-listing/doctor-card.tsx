import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { femaleAvatar, maleAvatar } from "../../images";
import { IDoctor } from "./doctor-mock";
import { IGroupSearch } from "./group-search";

const DoctorCard = (docProps: IDoctor) => {
    const {
        name,
        speciality,
        experience,
        fees,
        gender,
        hprId,
        bookCTA = true,
        isGroupConsult,
    } = docProps || {};
    const navigate = useNavigate();

    const { docProfile: routedDocProfile } =
        (useLocation().state as IGroupSearch) || {};

    return (
        <div className="doctor-card">
            <div className="card-main">
                <div className={`doc-name-logo`}>
                    <img
                        src={gender === "M" ? maleAvatar : femaleAvatar}
                        alt="Doctor Name"
                    />
                    <div className="doc-info-container">
                        <div className="doc-name">
                            {"Dr. " +
                                (name?.split("-")[1]?.trim() || name?.trim())}
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
            {bookCTA && (
                <div className="footer">
                    <Button
                        className={`book-apt-btn`}
                        onClick={() =>
                            isGroupConsult
                                ? navigate("/eua/search-group/slots", {
                                      state: {
                                          doctorProfile1: routedDocProfile,
                                          doctorProfile2: docProps,
                                      },
                                  })
                                : navigate(`/eua/search/${hprId}`, {
                                      state: docProps,
                                  })
                        }
                        disabled={false}
                        style={{ width: "100%" }}
                    >
                        <span>
                            {isGroupConsult
                                ? "Select Doctor"
                                : `Book Appointment`}
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DoctorCard;
