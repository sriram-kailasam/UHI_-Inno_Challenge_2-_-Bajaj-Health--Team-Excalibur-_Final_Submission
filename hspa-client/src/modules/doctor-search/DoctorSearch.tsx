/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { AppointmentData } from "modules/dashboard/types";
import Header from "app/components/Header";
import { useDebounceSearch } from "./useDebounceSearch";
import useDoctorSearch from './services/useDoctorSearch';
import { DoctorSearchResponse } from "./types";
import DoctorCard from "./components/DoctorCard";

const DoctorSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearchResult, setDoctorSearchResult] = useState<DoctorSearchResponse[]>([])
  const debounceSearchQuery = useDebounceSearch(searchQuery);
  const { mutation: { mutate: doctorSearch }} = useDoctorSearch();
  const appointmentData = location.state as AppointmentData;

  const handleOnBack = () => {
    navigate('../patientDetails', { state: appointmentData });
  }

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
};

useEffect(() => {
  if (debounceSearchQuery) {
    doctorSearch({ name: debounceSearchQuery}, {
      onSuccess: (response) => {
        setDoctorSearchResult(response.data.searchResults)
      }
    })
  }
}, [debounceSearchQuery]);

  return (
    <>
      <Header heading='Select Doctor' onBack={handleOnBack}/>
      <div className="min-h-screen msx-h-full w-full p-4 mt-16 bg-[#f2f3f9]">
        <TextField value={searchQuery} onChange={handleSearchTextChange} fullWidth size="small" placeholder="Search doctor" InputProps={{
            startAdornment: <InputAdornment position="start">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>,
          }}/>
        <div className="mt-4">
          {doctorSearchResult.map((doctor, index) => 
            <DoctorCard {...doctor} key={index} />
          )}
        </div>
      </div>
    </>
  )
}

export default DoctorSearch;