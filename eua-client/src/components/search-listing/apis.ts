import axios from "axios";
import { baseUrl } from "../../utils/constants";

export const searchDoctor = (keyword: string) => {
    return axios.get(`${baseUrl}/eua/searchDoctors?name=${keyword}`);
};
