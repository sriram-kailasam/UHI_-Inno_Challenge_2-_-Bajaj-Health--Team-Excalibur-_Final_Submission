import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { femaleAvatar, maleAvatar } from "../../images";
import { IDoctor } from "./doctor-mock";

const DoctorCard = (docProps: IDoctor) => {
    const { name, speciality, experience, fees, gender, hprId, slots } =
        docProps || {};
    const navigate = useNavigate();
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
                            {"Dr. " + name?.split("-")[1]?.trim()}
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
            <div className="footer">
                <Button
                    className={`book-apt-btn`}
                    onClick={() =>
                        navigate(`/eua/search/${hprId}`, {
                            state: docProps,
                        })
                    }
                    disabled={false}
                    style={{ width: "100%" }}
                >
                    <span>{`Book Appointment`}</span>
                </Button>
            </div>
        </div>
    );
};

export default DoctorCard;
