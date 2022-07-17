import axios, { AxiosResponse } from "axios";
import { baseUrl } from "../../utils/constants";
import { IBookPayload } from "../app-pay/apis";

export interface IMyAppnts {
    results: IBookPayload[];
}

export const listMyApp: (k: string) => Promise<AxiosResponse<IMyAppnts>> = (
    abhaAddress: string
) => {
    return axios.get(
        `${baseUrl}/eua/getAppointmentList?abhaAddress=${abhaAddress}`
    );
};
