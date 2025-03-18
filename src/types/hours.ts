export type Hour = `${number}:${number}`

export type Day = {
  dayValue: `${ValidDay}/${ValidMonth}`,
  hours: DayHours
}

export type DayHours = {
  in: Hour,
  out: Hour
}

const validDays = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ] as const;
const validMonths = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] as const;

export type ValidDay = typeof validDays[number];
export type ValidMonth = typeof validMonths[number];