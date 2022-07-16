import { maleAvatar } from "../../images";
import { IDoctor } from "../search-listing/doctor-mock";

export interface IMyApp extends IDoctor {
    appointmentStatus?: "Success" | "Failed";
}

export const myAppMock: IMyApp[] = [
    {
        name: "- Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: maleAvatar,
        languages: ["English", "Hindi"],
        gender: "F",
        education: "Masters",
        slots: [
            {
                slotId: "yjhnj",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
            {
                slotId: "yjhnj2",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
            {
                slotId: "yjhnj3",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
            {
                slotId: "yjhnj4",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
        ],
        appointmentStatus: "Success",
    },
    {
        name: "- Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: maleAvatar,
        languages: ["English", "Hindi"],
        gender: "F",
        education: "Masters",
        slots: [
            {
                slotId: "yjhnj",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
            {
                slotId: "yjhnj2",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
            {
                slotId: "yjhnj3",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
            {
                slotId: "yjhnj4",
                startTime: "2022-07-16T12:22:09.091Z",
                endTime: "2022-07-16T14:22:09.091Z",
            },
        ],
        appointmentStatus: "Failed",
    },
];
