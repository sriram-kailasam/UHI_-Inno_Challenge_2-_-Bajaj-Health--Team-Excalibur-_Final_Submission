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
      tags: z.object({
        "@abdm/gov.in/slot_id": z.string().nullish(),
        "@abdm/gov.in/group_consult": z.boolean().nullish(),
        "@abdm/gov.in/primary_doctor_hpr_id": z.string().nullish(),
        "@abdm/gov.in/secondary_doctor_hpr_id": z.string().nullish()
      })
    }),
    customer: z.object({ id: z.string(), cred: z.string() })
  })
})

export type InitRequest = z.infer<typeof initSchema>