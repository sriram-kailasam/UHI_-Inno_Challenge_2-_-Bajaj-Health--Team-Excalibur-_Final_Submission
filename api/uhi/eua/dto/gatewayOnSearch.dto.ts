import { z } from "zod"

export const gatewayOnSearchRequestSchema = z.object({
  message: z.object({
    catalog: z.object({
      fulfillments: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          agent: z.object({
            id: z.string(),
            name: z.string(),
            image: z.string().nullish(),
            gender: z.string(),
            tags: z.object({
              "@abdm/gov/in/first_consultation": z.string(),
              "@abdm/gov/in/experience": z.string(),
              "@abdm/gov/in/languages": z.string(),
              "@abdm/gov/in/speciality": z.string(),
              "@abdm/gov/in/education": z.string(),
              "@abdm/gov/in/hpr_id": z.string(),
            }),
          }),
        })
      )
    }),
  }),
  context: z.object({
    timestamp: z.string(),
    consumer_id: z.string(),
    consumer_uri: z.string(),
    provider_id: z.string(),
    provider_uri: z.string(),
    transaction_id: z.string(),
  })
})


export type GatewayOnSearchRequest = z.infer<typeof gatewayOnSearchRequestSchema>