import { z } from "zod"

export const sendMessageRequestSchema = z.object({
  senderId: z.string(),
  receiverId: z.array(z.string()),
  timestamp: z.string(),
  appointmentId: z.string().optional(),
  content: z.object({
    id: z.string(),
    value: z.string(),
  })
})

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>