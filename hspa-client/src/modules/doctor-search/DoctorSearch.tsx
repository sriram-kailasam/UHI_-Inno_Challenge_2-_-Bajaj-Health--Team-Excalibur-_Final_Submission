import { useLocation, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { AppointmentData } from "modules/dashboard/types";
import Header from "app/components/Header";

const DoctorSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentData = location.state as AppointmentData;

  const handleOnBack = () => {
    navigate('../patientDetails', { state: appointmentData });
  }

  return (
    <>
      <Header heading='Select Doctor' onBack={handleOnBack}/>
      <div className="min-h-screen msx-h-full w-full p-4 mt-16 bg-[#f2f3f9]">
        <TextField fullWidth size="small" placeholder="Search doctor" InputProps={{
            startAdornment: <InputAdornment position="start">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>,
          }}/>
        <p>Doctor Search</p>
      </div>
    </>
  )
}

export default DoctorSearch;