import dayjs from "dayjs";
import { ISlot } from "../search-listing/doctor-mock";

export const findCommonSlots = (
    slots1: ISlot[],
    slots2: ISlot[]
): ISlot[] | [] => {
    if (!slots1.length || !slots2.length) {
        return [];
    }

    const formattedSlot2 = slots2.map((each) => each.startTime);
    const allSlots: any = {};
    const filteredSlots = slots1.forEach((eachSlot1) => {
        for (let i = 0; i < formattedSlot2.length; i++) {
            if (
                dayjs(formattedSlot2[i]).isSame(eachSlot1.startTime, "date") &&
                dayjs(formattedSlot2[i]).isSame(eachSlot1.startTime, "hour") &&
                dayjs(formattedSlot2[i]).isSame(eachSlot1.startTime, "minutes")
            ) {
                allSlots[eachSlot1.slotId] = eachSlot1;
            }
        }
    });
    return Object.values(allSlots);
};

// ("2022-09-26T10:30:00.000Z");
// ("42c14d95-b3ff-4538-b769-853cb904a082");
// ("2022-09-26T10:00:00.000Z");

// ("2022-09-26T11:00:00.000Z");
// ("c567d17e-fa7e-4ec7-be53-6014d6a5cc98");
// ("2022-09-26T10:00:00.000Z");
