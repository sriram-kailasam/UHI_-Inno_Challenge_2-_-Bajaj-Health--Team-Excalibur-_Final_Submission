import { z } from "zod";

export const uhiPayload = (messageType: z.ZodType) => z.object({
  context: z.any(),
  message: messageType
})

export type UhiPayload<T> = {
  context: {
    consumer_uri: string;
    provider_uri?: string;
    transaction_id?: string;
  };
  message: T;
}
