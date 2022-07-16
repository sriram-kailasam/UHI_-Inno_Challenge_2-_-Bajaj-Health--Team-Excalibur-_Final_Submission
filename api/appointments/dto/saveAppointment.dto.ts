import { z } from "zod"

export const saveAppointmentRequestSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  slotId: z.string(),
  hprId: z.string(),
  isGroupConsult: z.boolean(),
  doctor: z.object({
    name: z.string(),
    gender: z.string().nullish()
  }),
  patient: z.object({
    name: z.string(),
    age: z.string().optional(),
    abhaAddress: z.string(),
    gender: z.string().optional()
  })
})

export type SaveAppointmentRequest = z.infer<typeof saveAppointmentRequestSchema>