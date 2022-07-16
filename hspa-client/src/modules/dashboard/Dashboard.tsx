/* eslint-disable react-hooks/exhaustive-deps */
import useGetAppointmentList from './services/useGetAppointmentList';
import Header from 'app/components/Header';
import AppointmentCard from './components/AppointmentCard';
import { AppointmentData } from './types';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const hpAddress = 'sdf@hpr.abdm';
  const [appointmentList, setAppointmentList] = useState<AppointmentData[]>([]);
  const { isLoading, data } = useGetAppointmentList(hpAddress);

  useEffect(() => {
    if (data && !isLoading) {
      setAppointmentList(data);
    }
  }, [data]);

  return (
    <div className='max-w-md flex flex-col items-center m-auto'>
      <Header heading='Patient Appointment List' onBack={() => console.log('nothing')}/>
      <div className='bg-[#f2f3f9] min-h-screen msx-h-full w-full p-4 mt-16'>
        {appointmentList.map((appt) => 
          <AppointmentCard {...appt} />
        )}
      </div>
    </div>
  )
}

export default Dashboard;