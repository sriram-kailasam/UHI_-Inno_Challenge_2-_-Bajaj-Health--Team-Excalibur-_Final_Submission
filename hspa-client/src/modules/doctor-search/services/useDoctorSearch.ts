import axios from "axios";
import { useMutation } from "react-query";
import { DoctorSearchPayload, DoctorSearchListResponse } from '../types';

const doctorSearch = async (payload: DoctorSearchPayload) => {
  const response = await axios.get<DoctorSearchListResponse>(`${process.env.REACT_APP_BASE_URL}/eua/searchDoctors`, {
    params: {
      name: payload.name
    }
  });
  if (response.status >= 400) return Promise.reject(response);
  return response;
};

const useDoctorSearch = () => {
  const mutation = useMutation(doctorSearch);
  return { mutation };
}

export default useDoctorSearch;