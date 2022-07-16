import { z } from "zod";

export const uhiPayload = (messageType: z.ZodType) => z.object({
  context: z.any(),
  message: messageType
})

export type UhiPayload<T> = {
  context: unknown;
  message: T;
}

type Doctor = {
  name: string;
  experience: number;
  hprId: string;
  fees: number;
  languages: string[];
  imageUri: string;
  gender: 'M' | 'F';
  speciality: string;
  education: string;
  slots: Slot[]
}

type Slot = {
  slotId: string;
  startTime: string;
  endTime: string;
}
