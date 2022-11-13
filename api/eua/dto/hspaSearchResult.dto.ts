import { z } from "zod"

export const hspaSearchResultSchema = z.object({
  catalog: z.object({
    descriptor: z.object({
      name: z.string().optional()
    }).optional(),
    providers: z.array(
      z.object({
        id: z.string().optional(),
        descriptor: z.object({
          name: z.string().optional()
        }).optional(),
        fulfillments: z.array(
          z.object({
            id: z.string(),
            start: z.object({ time: z.object({ timestamp: z.string() }) }),
            end: z.object({ time: z.object({ timestamp: z.string() }) }),
          })
        ),
        locations: z.array(z.any())
      })
    )
  })
})

export type HspaSearchResult = z.infer<typeof hspaSearchResultSchema>