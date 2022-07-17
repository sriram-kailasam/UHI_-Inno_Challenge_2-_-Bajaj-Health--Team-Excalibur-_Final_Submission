import axios, { AxiosResponse } from "axios";
import { baseUrl } from "../../utils/constants";
import { IDoctors } from "./doctor-mock";

export const searchDoctor: (k: string) => Promise<AxiosResponse<IDoctors>> = (
    keyword: string
) => {
    return axios.get(`${baseUrl}/eua/searchDoctors?name=${keyword}`);
};
