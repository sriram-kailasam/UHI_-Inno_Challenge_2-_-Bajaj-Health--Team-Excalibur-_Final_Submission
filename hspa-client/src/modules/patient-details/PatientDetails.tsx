import { useLocation } from "react-router-dom";

const PatientDetails = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <>
      <p>Patient details</p>
    </>
  )
}

export default PatientDetails;