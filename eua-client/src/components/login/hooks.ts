import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../redux/slice/user";
import { useDebounce } from "../../utils/helper";
import { requestOTP } from "./api";

export const useLoginWrapper = () => {
    const [abhaAddress, setAbhaAddress] = useState("");
    const [isOtpRequested, setIsOtpRequested] = useState(false);
    const [requestData, setRequestData] = useState({
        transactionId: "",
        requesterId: "",
    });
    const dispatch = useDispatch();
    const debAbhaAddress = useDebounce(abhaAddress);
    const [isLogging, setIsLogging] = useState(false);

    const isLoginActive = !!(abhaAddress && abhaAddress.length);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAbhaAddress(e.target.value);
    };

    const handleLoginPress = () => {
        setIsLogging(true);
        requestOTP(debAbhaAddress)
            .then(({ data }) => {
                setIsOtpRequested(true);
                setRequestData(data.data);
            })
            .finally(() => {
                setIsLogging(false);
            });
    };

    useEffect(() => {
        dispatch(
            updateProfile({
                profile: {
                    id: debAbhaAddress,
                },
            })
        );
    }, [debAbhaAddress]);

    return {
        isOtpRequested,
        handleInputChange,
        handleLoginPress,
        isLoginActive,
        requestData,
        isLogging,
    };
};
