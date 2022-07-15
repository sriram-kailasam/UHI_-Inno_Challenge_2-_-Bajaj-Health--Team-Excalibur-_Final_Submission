import axios from "axios";
import { useMutation } from "react-query";
import { LoginPayload, LoginResponse } from '../types';

const loginUser = async (payload: LoginPayload) => {
  const response = await axios.post<LoginResponse>(`${process.env.REACT_APP_BASE_URL}/hspa/login`, {
    data: {
      hpAddress: payload.hpAddress,
      password: payload.password,
    }
  });
  if (response.status >= 400) return Promise.reject(response);
  return response;
};

const useLoginUser = () => {
  const mutation = useMutation(loginUser);
  return { mutation };
}

export default useLoginUser;