import axios from "axios";
import { baseUrl } from "../../utils/constants";

export const requestOTP = (phrAddress: string) => {
    return axios.post(`${baseUrl}/health-id/address/login/genrateOtp`, {
        phrAddress,
    });
};

export const validateOTP = (payload: {
    transactionId: string;
    requesterId: string;
    otp: string;
}) => {
    return axios.post(
        `${baseUrl}/health-id/address/login/validateOtp`,
        payload
    );
};
