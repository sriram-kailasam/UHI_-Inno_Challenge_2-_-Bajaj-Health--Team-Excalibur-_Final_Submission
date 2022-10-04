import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc);

const withoutTimezoneFormat = "YYYY-MM-DDTHH:mm:ss";
const withoutTimezoneLength = withoutTimezoneFormat.length;

export function addTimezone(time: string): string {
  if (time?.length <= withoutTimezoneLength) {
    return dayjs(time, withoutTimezoneFormat).utcOffset("+0530", true).format();
  }

  return time;
}
