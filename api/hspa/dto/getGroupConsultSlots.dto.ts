import { z } from "zod"
import { Slot } from "../../eua/dto/slot.dto";

export const getGroupConsultSlotsRequestSchema = z.object({
  primaryHprId: z.string(),
  secondaryHprId: z.string(),
  appointmentStartTime: z.string()
})

export type GroupConsultSlot = {
  slotId: string;
  primaryDoctorSlot: Slot;
  secondaryDoctorSlot: Slot;
}

export type GetGroupConsultSlotsRequest = z.infer<typeof getGroupConsultSlotsRequestSchema>
