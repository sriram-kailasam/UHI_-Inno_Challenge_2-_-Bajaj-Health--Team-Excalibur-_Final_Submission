import axios from "axios";
import { useMutation } from "react-query";
import { BASE_URL } from "shared/constants";
import { type MessageResponse, type MessagePayload } from "../types";

const message = async (payload: MessagePayload) => {
  const response = await axios.post<MessageResponse>(
    `${BASE_URL}/hspa/sendMessage`,
    payload
  );
  if (response.status >= 400) return Promise.reject(response);
  return response;
};

export const useMessage = () => {
  const mutation = useMutation(message);
  return { mutation };
};

export default message;
