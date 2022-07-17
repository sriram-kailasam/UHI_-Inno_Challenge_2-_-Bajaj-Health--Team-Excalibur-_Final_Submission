import axios from "axios";
import { baseUrl } from "../../utils/constants";
import { ISlot } from "../search-listing/doctor-mock";

export interface IBookPayload extends ISlot {
    hprId: string;
    doctor: {
        name: string;
        gender: "M" | "F";
    };
    patient: {
        name: string;
        abhaAddress: string;
    };
    isGroupConsult: boolean;
    groupConsult?: {
        hprId: string;
        name: string;
    };
}

export const bookAppointment = (payload: IBookPayload) => {
    return axios.post(`${baseUrl}/eua/bookAppointment`, payload);
};
