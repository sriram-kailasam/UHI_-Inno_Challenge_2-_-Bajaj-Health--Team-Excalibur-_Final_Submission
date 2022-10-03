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

export const bookGroupConsultRequestSchema = z.object({
  "startTime": z.string(),
  "endTime": z.string(),
  "slotId": z.string(),

  "primaryDoctor": z.object({
    "hprId": z.string(),
    "name": z.string().nullish(),
    "gender": z.string().nullish()
  }),
  "secondaryDoctor": z.object({
    "hprId": z.string(),
    "name": z.string().nullish()
  }),

  "patient": z.object({
    "name": z.string(),
    "abhaAddress": z.string()
  })
})

export type SaveAppointmentRequest = z.infer<typeof saveAppointmentRequestSchema>
export type BookGroupConsultRequest = z.infer<typeof bookGroupConsultRequestSchema>