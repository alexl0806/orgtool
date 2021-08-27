// @ts-ignore
import * as dates from "react-big-calendar/lib/utils/dates";
import { DateLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocalizedFormat);
dayjs.extend(localeData);

let dateRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, "L", culture) + " – " + local.format(end, "L", culture);

let timeRangeFormat = ({ start, end }, culture, local) =>
  local.format(end, "LT", culture);

let timeRangeStartFormat = ({ start }, culture, local) =>
  local.format(start, "LT", culture) + " – ";

let timeRangeEndFormat = ({ end }, culture, local) =>
  " – " + local.format(end, "LT", culture);

let weekRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, "MMMM DD", culture) +
  " – " +
  local.format(end, dates.eq(start, end, "month") ? "DD" : "MMMM DD", culture);

export let formats = {
  dateFormat: "DD",
  dayFormat: "DD ddd",
  weekdayFormat: "ddd",

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: "LT",

  monthHeaderFormat: "MMMM YYYY",
  dayHeaderFormat: "dddd MMM DD",
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: "ddd MMM DD",
  agendaTimeFormat: "LT",
  agendaTimeRangeFormat: timeRangeFormat,
};

const dayjsLocalizer = () => {
  let locale = (m, c) => (c ? m.locale(c) : m);

  return new DateLocalizer({
    formats,
    firstOfWeek(culture) {
      let data = dayjs.localeData();
      return data ? data.firstDayOfWeek() : 0;
    },

    format(value, format, culture) {
      return locale(dayjs(value), culture).format(format);
    },
  });
};

const localizer = dayjsLocalizer();

export default localizer;
