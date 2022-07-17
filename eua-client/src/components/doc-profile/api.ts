import axios, { AxiosResponse } from "axios";
import { baseUrl } from "../../utils/constants";
import { ISlots } from "../search-listing/doctor-mock";

export const getSlots: (k: string) => Promise<AxiosResponse<ISlots>> = (
    hprId: string
) => {
    return axios.get(`${baseUrl}/eua/getSlots?hprId=${hprId}`);
};
