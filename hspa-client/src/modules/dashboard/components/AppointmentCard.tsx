import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import Button from '@mui/material/Button';
import CalendarIcon from 'shared/assests/calendarIcon.svg';
import ClockIcon from 'shared/assests/clockIcon.svg';
import VideoCameraIcon from 'shared/assests/videoCameraIcon.svg';
import MaleAvatar from 'shared/assests/maleAvatar.svg';
import FemaleAvatar from 'shared/assests/femaleAvatar.svg';
import AbhaLogo from 'shared/assests/abhaLogo.jpg';
import { AppointmentData } from '../types';

const AppointmentCard: React.FC<AppointmentData> = ({ ...appointmentData }) => {
  const navigate = useNavigate();
  const getAppointmentDate = () => {
    return moment(appointmentData.appointment.startTime).format('DD MMM YYYY')
  };

  const formatTime = (time: string) => {
    return moment(time).format('hh:mm A');
  }

  const getPatientGender = () => {
    if (appointmentData.patient.gender?.[0].toLowerCase() === 'm') {
      return 'Male';
    }
    return 'Female';
  }
  
  const getPatientAvatar = () => {
    if (appointmentData.patient.gender?.[0].toLowerCase() === 'm') {
      return MaleAvatar;
    } 
    return FemaleAvatar;
  }

  const handleViewPatientProfile = () => {
    navigate('../patientDetails', { state: appointmentData })
  }

  return (
    <div className='h-44 bg-white first:mt-0 mt-4 rounded-lg p-2 flex flex-col justify-between' key={appointmentData.appointment.id}>
      <div className='flex justify-between border-b-[#ebebeb] border-b items-center pt-1 pb-2'>
        <div className='flex'>
          <img src={CalendarIcon} alt="Calendar Icon" className='ml-1'/>
          <div className='text-xs ml-2 text-[#4b4b4b]'>{getAppointmentDate()}</div>
        </div>
        <div className='flex'>
          <img src={ClockIcon} alt="Clock Icon" />
          <div className='text-xs ml-2 text-[#4b4b4b]'>{formatTime(appointmentData.appointment.startTime)}</div>
          <div className='text-xs ml-1 text-[#4b4b4b]'>-</div>
          <div className='text-xs ml-1 text-[#4b4b4b] mr-3'>{formatTime(appointmentData.appointment.endTime)}</div>
        </div>
      </div>
      <div className='flex flex-col grow-[0.4] justify-between'>
        <div className='flex'>
          <img src={getPatientAvatar()} alt='avatar' className='h-9 w-9' />
          <div className='ml-4'>
            <div className='text-sm text-[#4b4b4b] font-semibold'>
              {appointmentData.patient.name}
            </div>
            <div className='text-xs text-[#767676] mt-1'>
              <span>{getPatientGender()} | {appointmentData.patient.age} Yrs</span>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          {appointmentData.isGroupConsult && <div className='text-xs text-[#4b4b4b] font-semibold'>
            {appointmentData.groupConsult?.name || ''}
          </div>}
          <div className='flex items-center mr-2'>
            <img src={AbhaLogo} alt='abha logo' className='h-6 w-6'/>
            <span className='text-xs text-[#4b4b4b] font-semibold'>{appointmentData.patient.abhaAddress}</span>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between border-t border-t-[#ebebeb] pt-1'>
        <div>
        <Button fullWidth className='!p-2 !ml-2 !text-xs !bg-[#f2f3f9] !h-6 !text-[#4b4b4b] !normal-case !shadow-none' variant='contained'>
          <img src={VideoCameraIcon} alt='video camera' />
          <span className='ml-2'>Video Consult</span>
        </Button>
        </div>
        {!appointmentData.isGroupConsult && <div className='text-sm mr-2 text-[#5c2d90] font-semibold' onClick={handleViewPatientProfile}>
          View details
        </div>}
      </div>
    </div>
  )
}

export default AppointmentCard;