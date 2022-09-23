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

export interface IBookGroupPayload {
    startTime: string;
    endTime: string;
    slotId: string;
    primaryDoctor: {
        hprId: string;
        name: string;
    };
    secondaryDoctor: {
        hprId: string;
        name: string;
    };
    patient: {
        name: string;
        abhaAddress: string;
    };
}

export const bookAppointment = (payload: IBookPayload) => {
    return axios.post(`${baseUrl}/eua/bookAppointment`, payload);
};

export const bookAppointmentGroup = (payload: IBookGroupPayload) => {
    return axios.post(`${baseUrl}/hspa/bookGroupConsult`, payload);
};
