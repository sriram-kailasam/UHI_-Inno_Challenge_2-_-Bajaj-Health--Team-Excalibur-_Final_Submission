import { z } from "zod"

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
          "@abdm/gov/in/education": z.string(),
          "@abdm/gov/in/experience": z.string(),
          "@abdm/gov/in/first_consultation": z.string(),
          "@abdm/gov/in/speciality": z.string(),
          "@abdm/gov/in/languages": z.string(),
          "@abdm/gov/in/hpr_id": z.string()
        })
      }),
      start: z.object({ time: z.object({ timestamp: z.string() }) }),
      end: z.object({ time: z.object({ timestamp: z.string() }) }),
      tags: z.object({ "@abdm/gov.in/slot_id": z.string() })
    }),
    customer: z.object({ id: z.string(), cred: z.string() })
  })
})

export type InitRequest = z.infer<typeof initSchema>