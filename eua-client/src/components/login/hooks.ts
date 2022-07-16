import { useState } from "react";

export const useLoginWrapper = () => {
    const [loginDetails, setLoginDetails] = useState({
        address: "",
        isOtpRequested: "",
    });

    return {
        loginDetails,
        setLoginDetails,
    };
};
