import axios from "axios";

export const requestOTP = (phrAddress: string) => {
    return axios.post(
        `https://bfhldevapigw.healthrx.co.in/phr-identity-module-prod/api/health-id/address/login/genrateOtp`,
        {
            phrAddress,
        }
    );
};

export const validateOTP = (payload: {
    transactionId: string;
    requesterId: string;
    otp: string;
}) => {
    return axios.post(
        `https://bfhldevapigw.healthrx.co.in/phr-identity-module-prod/api/health-id/address/login/validateOtp`,
        payload
    );
};
