import { z } from "zod"

export const searchRequestSchema = z.object({
  intent: z.object({
    fulfillment: z.object({
      type: z.string(),
      agent: z.object({ name: z.string().nullish(), cred: z.string().nullish() }),
    })
  }),
})

export type SearchRequest = z.infer<typeof searchRequestSchema>