import { z } from "zod"
import { addTimezone } from "../../../util/addTimeZone"

export const initSchema = z.object({
  order: z.object({
    id: z.string(),
    billing: z.object({
      name: z.string(),
    }),
    fulfillment: z.object({
      id: z.string(),
      type: z.string(),
      agent: z.object({
        id: z.string(),
        name: z.string(),
        gender: z.string(),
        tags: z.object({
          "@abdm/gov.in/groupConsultation": z.string().nullish(),
          "@abdm/gov.in/primaryHprAddress": z.string().nullish(),
          "@abdm/gov.in/secondaryHprAddress": z.string().nullish(),
          "@abdm/gov.in/patientName": z.string().nullish(),
          "@abdm/gov.in/patientPHRAddress": z.string().nullish(),
          "@abdm/gov.in/patientGender": z.string().nullish(),
          "@abdm/gov.in/primaryDoctorName": z.string().nullish(),
          "@abdm/gov.in/primaryDoctorGender": z.string().nullish(),
          "@abdm/gov.in/primaryDoctorProviderUrl": z.string().nullish(),
          "@abdm/gov.in/secondaryDoctorName": z.string().nullish(),
          "@abdm/gov.in/secondaryDoctorGender": z.string().nullish(),
          "@abdm/gov.in/secondaryDoctorProviderUrl": z.string().nullish(),
          "@abdm/gov.in/consumerUrl": z.string().nullish()
        })
      }),
      start: z.object({
        time: z.object({
          timestamp: z.string().transform(addTimezone)
        })
      }),
      end: z.object({
        time: z.object({
          timestamp: z.string().transform(addTimezone)
        })
      }),
    }),
    customer: z.object({ id: z.string(), cred: z.string() })
  })
})

export type InitRequest = z.infer<typeof initSchema>