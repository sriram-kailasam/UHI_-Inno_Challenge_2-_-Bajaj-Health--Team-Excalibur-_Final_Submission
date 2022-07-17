import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { getPatientAvatar } from 'shared/utils/utils';
import { DoctorSearchResponse } from "../types";
import './doctorCard.scss';

const DoctorCard: React.FC<DoctorSearchResponse> = ({ ...props }) => {
  const navigate = useNavigate();
  const getDoctorName = () => {
    return props.name.split(' - ')?.[1] || '';
  }

  const handleDoctorBooking = () => {
    navigate('../apptBooking', { state: props });
  }

  return (
    <div className="doctor-card">
      <div className="card-main">
        <div className="top-row">
        </div>
        <div className="doc-name-logo">
          <img src={getPatientAvatar(props.gender)} alt="Doctor Name" />
          <div className="doc-info-container">
            <div className="doc-name">Dr. {getDoctorName()}</div>
            <div className="doc-info">
              <span className="doc-spec">{props.education}</span>
              <div className="line-vert"></div>
              <span className="doc-exp">{props.experience} Yrs</span>
            </div>
            <div className="doc-fee-container">
              <span className="doc-fees">₹ {props.fees}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <Button className="book-apt-btn" onClick={handleDoctorBooking}>
          <span>Book Appointment</span>
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
