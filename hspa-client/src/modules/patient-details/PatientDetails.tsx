import { useLocation, useNavigate } from "react-router-dom";
import moment from 'moment'
import Button from '@mui/material/Button';
import { AppointmentData } from "modules/dashboard/types";
import Header from "app/components/Header";
import VideoCameraIcon from 'shared/assests/videoCameraIcon.svg';
import Card from './components/Card';
import { getPatientAvatar, getPatientGender } from 'shared/utils/utils';

const PatientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentData = location.state as AppointmentData;

  const handleOnBack = () => {
    navigate('../dashboard');
  }

  const getAppointmentDate = () => {
    return moment(appointmentData.appointment.startTime).format('dddd d MMM - h:mm A')
  }

  const handleDoctorSearchNavigate = () => {
    navigate('../doctorSearch', { state: appointmentData })
  }

  const cards = [
    {
      id: 1,
      heading: 'Create new prescription',
    },
    {
      id: 2,
      heading: 'Medical records',
    },
    {
      id: 3,
      heading: 'Chat with the patient',
    }
  ]
  return (
    <>
      <Header heading='Patient Details' onBack={handleOnBack}/>
      <div className='min-h-screen msx-h-full w-full p-4 mt-16 bg-[#f2f3f9]'>
        <div className="flex items-center">
          <img src={getPatientAvatar(appointmentData.patient.gender?.toString() || '')} alt='patient' className="h-24 w-24" />
          <div className="ml-4">
            <div className="text-base text-[#4b4b4b] font-semibold">
              {appointmentData.patient.name}
            </div>
            <div className="text-sm text-[#767676]">
              {getPatientGender(appointmentData.patient.gender?.toString() || '')} | {appointmentData.patient.age} Yrs
            </div>
          </div>
        </div>
        <div className="rounded-lg mt-3 p-2 shadow-md bg-white">
          <div className="flex flex-col">
            <span className="text-xs text-[#4b4b4b] font-semibold">{getAppointmentDate()}</span>
            <Button className='!p-2 !mt-4 !ml-2 !text-xs !bg-[#f2f3f9] !h-6 !text-[#4b4b4b] !normal-case !shadow-none' variant='contained'>
              <img src={VideoCameraIcon} alt='video camera' />
              <span className='ml-2'>Video Consult</span>
            </Button>
          </div>
        </div>
        {cards.map((i) => 
          <Card {...i} />
        )}
        <Button fullWidth className='!mt-20 !text-base !bg-[#0057cb] !h-12 !normal-case' variant='contained' onClick={handleDoctorSearchNavigate}>
          <img src={VideoCameraIcon} alt='video camera' />
          <span className='ml-2'>Add Doctor</span>
        </Button>
      </div>
    </>
  )
}

export default PatientDetails;