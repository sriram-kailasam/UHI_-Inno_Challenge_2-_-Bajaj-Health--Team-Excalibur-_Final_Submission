import { doctorMale } from "../../images";

export interface ISlot {
    slotId: string;
    startTime: string;
    endTime: string;
}

export interface ISlots {
    slots: ISlot[];
}

export interface IDoctor {
    name: string;
    experience: number;
    hprId: string;
    fees: number;
    languages: string[];
    imageUri: string;
    gender: "M" | "F";
    speciality: string;
    education: string;
    slots: ISlot[];
    bookCTA?: boolean;
    isGroupConsult?: boolean;
}

export interface IDoctors {
    searchResults: IDoctor[];
}

export const doctorListing: IDoctor[] = [
    {
        name: "Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: doctorMale,
        languages: ["English", "Hindi"],
        gender: "M",
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
    },
    {
        name: "Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: doctorMale,
        languages: ["English", "Hindi"],
        gender: "M",
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
    },
    {
        name: "Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: doctorMale,
        languages: ["English", "Hindi"],
        gender: "M",
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
    },
    {
        name: "Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: doctorMale,
        languages: ["English", "Hindi"],
        gender: "M",
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
    },
    {
        name: "Dr. Ankita Chauhan",
        speciality: "General Physican",
        experience: 2,
        fees: 180,
        hprId: "some-random-id",
        imageUri: doctorMale,
        languages: ["English", "Hindi"],
        gender: "M",
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
    },
];
