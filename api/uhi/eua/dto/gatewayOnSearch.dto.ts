import { z } from "zod"

export const gatewayOnSearchRequestSchema = z.object({
  message: z.object({
    intent: z.null(),
    order: z.null(),
    catalog: z.object({
      fulfillments: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          agent: z.object({
            id: z.string(),
            name: z.string(),
            image: z.null(),
            dob: z.null(),
            gender: z.string(),
            cred: z.null(),
            tags: z.object({
              "@abdm/gov/in/first_consultation": z.string(),
              "@abdm/gov/in/upi_id": z.string(),
              "@abdm/gov/in/follow_up": z.string(),
              "@abdm/gov/in/experience": z.string(),
              "@abdm/gov/in/languages": z.string(),
              "@abdm/gov/in/speciality": z.string(),
              "@abdm/gov/in/lab_report_consultation": z.string(),
              "@abdm/gov/in/education": z.string(),
              "@abdm/gov/in/hpr_id": z.string(),
              "@abdm/gov/in/signature": z.null()
            }),
            phone: z.null(),
            email: z.null()
          }),
          person: z.null(),
          contact: z.null(),
          start: z.object({
            time: z.object({
              timestamp: z.string(),

            }),

          }),
          end: z.object({
            time: z.object({
              timestamp: z.string(),

            }),

          }),

        })
      )
    }),
    order_id: z.null()
  }),
  context: z.object({
    domain: z.string(),
    country: z.string(),
    city: z.string(),
    action: z.string(),
    timestamp: z.string(),
    key: z.null(),
    ttl: z.null(),
    core_version: z.string(),
    consumer_id: z.string(),
    consumer_uri: z.string(),
    provider_id: z.string(),
    provider_uri: z.string(),
    transaction_id: z.string(),
    message_id: z.null()
  })
})


export type GatewayOnSearchRequest = z.infer<typeof gatewayOnSearchRequestSchema>