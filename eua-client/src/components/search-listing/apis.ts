import axios, { AxiosResponse } from "axios";
import { baseUrl } from "../../utils/constants";
import { IDoctor } from "./doctor-mock";

export const searchDoctor: (k: string) => Promise<AxiosResponse<IDoctor[]>> = (
    keyword: string
) => {
    console.log("kjnkj", keyword);
    return axios.get(`${baseUrl}/eua/searchDoctors?name=${keyword}`);
};
