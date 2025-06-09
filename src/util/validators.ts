export const DEFAULT_TIME_RANGES = {
  hourStart: 6,
  hourEnd: 18,
  minuteStart: 0,
  minuteEnd: 59,
}

export type TimeRangeOptions = Partial<typeof DEFAULT_TIME_RANGES>;

export function isTimeInExpectedRanges(hour:number, minute: number, ranges: TimeRangeOptions= {}){
const hourStart = ranges.hourStart ?? DEFAULT_TIME_RANGES.hourStart;
const hourEnd = ranges.hourEnd ?? DEFAULT_TIME_RANGES.hourEnd;
const minuteStart = ranges.minuteStart ?? DEFAULT_TIME_RANGES.minuteStart;
const minuteEnd = ranges.minuteEnd ?? DEFAULT_TIME_RANGES.minuteEnd;

return (
  hour >= hourStart &&
  hour <= hourEnd &&
  minute >= minuteStart &&
  minute <= minuteEnd 
)
}