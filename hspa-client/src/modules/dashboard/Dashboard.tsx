/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from 'app/components/Header';
import useGetAppointmentList from './services/useGetAppointmentList';
import AppointmentCard from './components/AppointmentCard';
import { AppointmentData } from './types';

const Dashboard = () => {
  const navigate = useNavigate()
  const hpAddress = localStorage.getItem('hpAddress')?.toString() || '';
  const [appointmentList, setAppointmentList] = useState<AppointmentData[]>([]);
  const { isLoading, data } = useGetAppointmentList(hpAddress);

  useEffect(() => {
    if (data && !isLoading) {
      setAppointmentList(data.results);
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('../login');
  }

  return (
    <div className='max-w-md flex flex-col items-center m-auto'>
      <Header heading='Patient Appointment List' onBack={handleLogout}/>
      <div className='bg-[#f2f3f9] min-h-screen msx-h-full w-full p-4 mt-16'>
        {appointmentList.map((appt) => 
          <AppointmentCard {...appt} />
        )}
      </div>
    </div>
  )
}

export default Dashboard;