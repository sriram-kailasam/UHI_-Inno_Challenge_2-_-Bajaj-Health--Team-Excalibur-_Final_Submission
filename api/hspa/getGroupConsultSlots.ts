import { Slot } from "../eua/dto/slot.dto";
import dayjs from "dayjs"
import { v4 as uuid } from "uuid"
import { GroupConsultSlot } from "./dto/getGroupConsultSlots.dto";

export function getMatchingSlotPairs(slots1: Slot[], slots2: Slot[], minStartTime = new Date().toISOString()): GroupConsultSlot[] {
  const matchingSlots: GroupConsultSlot[] = [];

  sortSlots(slots1)
  sortSlots(slots2)

  slots1.forEach(s1 => {
    if (dayjs(s1.startTime).isBefore(minStartTime)) {
      return;
    }

    slots2.forEach(s2 => {
      if (dayjs(s2.startTime).isBefore(minStartTime)) {
        return;
      }

      if (between(s1.startTime, s2.startTime, s2.endTime) || between(s2.startTime, s1.startTime, s1.endTime)) {
        matchingSlots.push({ primaryDoctorSlot: s1, secondaryDoctorSlot: s2, slotId: uuid() })
      }
    })
  })

  return matchingSlots
}

function between(time: string, time1: string, time2: string): boolean {
  return dayjs(time).isBetween(time1, time2, undefined, '[)')
}

function sortSlots(slots: Slot[]) {
  slots.sort((s1, s2) => new Date(s2.startTime).getTime() - new Date(s1.startTime).getTime())
}