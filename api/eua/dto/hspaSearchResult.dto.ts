import { z } from "zod"

export const hspaSearchResultSchema = z.object({
  catalog: z.object({
    fulfillments: z.array(
      z.object({
        id: z.string(),
        start: z.object({ time: z.object({ timestamp: z.string() }) }),
        end: z.object({ time: z.object({ timestamp: z.string() }) }),
      })
    )
  })
})

export type HspaSearchResult = z.infer<typeof hspaSearchResultSchema>