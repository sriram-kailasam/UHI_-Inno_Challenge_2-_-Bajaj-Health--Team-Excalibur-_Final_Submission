import { z } from "zod"

export const gatewayOnSearchRequestSchema = z.object({
  catalog: z.object({
    descriptor: z.object({ name: z.string() }),
    providers: z.array(
      z.object({
        id: z.string(),
        descriptor: z.object({ name: z.string() }),
        categories: z.array(
          z.object({
            id: z.string(),
            descriptor: z.object({ name: z.string() })
          })
        ),
        fulfillments: z.array(
          z.object({
            id: z.string(),
            type: z.string(),
            agent: z.object({
              id: z.string(),
              name: z.string(),
              gender: z.string().optional(),
              tags: z.object({
                "@abdm/gov/in/first_consultation": z.string(),
                "@abdm/gov/in/upi_id": z.string().nullish(),
                "@abdm/gov/in/follow_up": z.string().nullish(),
                "@abdm/gov/in/experience": z.string(),
                "@abdm/gov/in/languages": z.string(),
                "@abdm/gov/in/education": z.string().nullish(),
                "@abdm/gov/in/hpr_id": z.string(),
              })
            }),
          })
        ),
        items: z.array(
          z.object({
            id: z.string(),
            descriptor: z.object({ name: z.string() }),
            category_id: z.string(),
            fulfillment_id: z.string()
          })
        ),
        locations: z.array(
          z.object({
            id: z.string(),
            descriptor: z.object({ name: z.string() }),
            city: z.object({ name: z.string(), code: z.string() }),
            country: z.object({ name: z.string(), code: z.string() }),
            gps: z.string(),
            address: z.string()
          })
        )
      })
    )
  })
})

export type GatewayOnSearchRequest = z.infer<typeof gatewayOnSearchRequestSchema>