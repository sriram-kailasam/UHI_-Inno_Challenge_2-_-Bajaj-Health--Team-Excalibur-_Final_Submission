import { z } from "zod";

export const onMessageDataSchema =
  z.object({
    intent: z.object({
      chat: z.object({
        sender: z.object({ person: z.object({ cred: z.string() }) }),
        reciever: z.object({ person: z.object({ cred: z.string() }) }),
        content: z.object({
          content_id: z.string().nullish(),
          content_value: z.string()
        }),
        time: z.object({ timestamp: z.string() })
      })
    })
  })

export type OnMessageRequest = z.infer<typeof onMessageDataSchema>