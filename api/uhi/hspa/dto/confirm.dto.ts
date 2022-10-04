import { z } from "zod"

export const confirmSchema = z.object({
  order: z.object({})
})

export type ConfirmRequest = z.infer<typeof confirmSchema>