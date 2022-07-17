import { z } from "zod"

export const gatewayOnSearchRequestSchema = z.object({
  message: z.object({
    catalog: z.object({
      fulfillments: z.array(
        z.object({
          id: z.string(),
          agent: z.object({
            id: z.string(),
            name: z.string(),
            image: z.string().nullish(),
            gender: z.string().nullish(),
            tags: z.object({
              "@abdm/gov/in/first_consultation": z.string().nullish(),
              "@abdm/gov/in/experience": z.string().nullish(),
              "@abdm/gov/in/languages": z.string().nullish(),
              "@abdm/gov/in/speciality": z.string().nullish(),
              "@abdm/gov/in/education": z.string().nullish(),
              "@abdm/gov/in/hpr_id": z.string().nullish(),
            }).nullish(),
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