import { useMutation } from "react-query";
import axios from "axios";

import { BASE_URL } from "shared/constants";
import { LoginPayload, LoginResponse } from '../types';

const loginUser = async (payload: LoginPayload) => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/hspa/login`, {
    hpAddress: payload.hpAddress,
    password: payload.password,
  });
  if (response.status >= 400) return Promise.reject(response);
  return response;
};

const useLoginUser = () => {
  const mutation = useMutation(loginUser);
  return { mutation };
}

export default useLoginUser;