import { Button } from "antd";
import { doctorMale } from "../../images";

const DoctorCard = () => {
    return (
        <div className="doctor-card">
            <div className="card-main">
                <div className="top-row">
                    <div className="next-slot">AVAILABLE AT 10;30 AM</div>
                    <div className="doc-id">#2378A</div>
                </div>
                <div className="doc-name-logo">
                    <img src={doctorMale} alt="Doctor Name" />
                    <div className="doc-info-container">
                        <div className="doc-name">Dr. Ankita Chauhan</div>
                        <div className="doc-info">
                            <span className="doc-spec">General Physican</span>
                            <div className="line-vert"></div>
                            <span className="doc-exp">2 Yrs</span>
                        </div>
                        <div className="doc-fee-container">
                            <span className="doc-fees">₹ 180</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <Button className="know-more-btn">
                    <span>Know More</span>
                </Button>
                <Button className="book-apt-btn">
                    <span>Book Appointment</span>
                </Button>
            </div>
        </div>
    );
};

export default DoctorCard;
