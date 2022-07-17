import axios from "axios";
import { useMutation } from "react-query";
import { BASE_URL } from "shared/constants";
import { ApptBookPayload, ApptBookResponse } from "../types";

const loginUser = async (payload: ApptBookPayload) => {
  const response = await axios.post<ApptBookResponse>(`${BASE_URL}/hspa/bookGroupConsult`, {
      startTime: payload.startTime,
      endTime: payload.endTime,
      slotId: payload.slotId,
      primaryDoctor: {
        hprId: payload.primaryDoctor.hprId,
        name: payload.primaryDoctor.name,
        gender: payload.primaryDoctor.gender,
      },
      secondaryDoctor: {
        hprId: payload.secondaryDoctor.hprId,
        name: payload.secondaryDoctor.name,
      },
      patient: {
        name: payload.patient.name,
        abhaAddress: payload.patient.abhaAddress,
      }
  });
  if (response.status >= 400) return Promise.reject(response);
  return response;
};

const useDoctorApptBooking = () => {
  const mutation = useMutation(loginUser);
  return { mutation };
}

export default useDoctorApptBooking;