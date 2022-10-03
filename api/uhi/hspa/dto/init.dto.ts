import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc'

import { z } from "zod"

dayjs.extend(customParseFormat)
dayjs.extend(utc);

const withoutTimezoneFormat = "YYYY-MM-DDTHH:mm:ss";
const withoutTimezoneLength = withoutTimezoneFormat.length;

function addTimezone(time: string): string {
  if (time?.length <= withoutTimezoneLength) {
    const converted = dayjs(time, withoutTimezoneFormat).utcOffset("+0530", true).format();
    console.log({ time, converted })
    return converted
  }

  return time;
}

export const initSchema = z.object({
  order: z.object({
    id: z.string(),
    billing: z.object({
      name: z.string(),
    }),
    fulfillment: z.object({
      id: z.string(),
      type: z.string(),
      agent: z.object({
        id: z.string(),
        name: z.string(),
        gender: z.string(),
      }),
      start: z.object({
        time: z.object({
          timestamp: z.string().transform(addTimezone)
        })
      }),
      end: z.object({
        time: z.object({
          timestamp: z.string().transform(addTimezone)
        })
      }),
      tags: z.object({
        "@abdm/gov.in/slot_id": z.string().nullish(),
        "@abdm/gov.in/group_consult": z.boolean().nullish(),
        "@abdm/gov.in/primary_doctor_hpr_id": z.string().nullish(),
        "@abdm/gov.in/secondary_doctor_hpr_id": z.string().nullish()
      })
    }),
    customer: z.object({ id: z.string(), cred: z.string() })
  })
})

export type InitRequest = z.infer<typeof initSchema>