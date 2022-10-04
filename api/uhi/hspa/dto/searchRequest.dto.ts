import { z } from "zod"
import { addTimezone } from "../../../util/addTimeZone"

export const searchRequestSchema = z.object({
  intent: z.object({
    fulfillment: z.object({
      type: z.string(),
      agent: z.object({ name: z.string().nullish(), cred: z.string().nullish() }),
      start: z.object({ time: z.object({ timestamp: z.string().transform(addTimezone) }) }).nullish(),
      end: z.object({ time: z.object({ timestamp: z.string().transform(addTimezone) }) }).nullish()
    })
  }),
})

export type SearchRequest = z.infer<typeof searchRequestSchema>