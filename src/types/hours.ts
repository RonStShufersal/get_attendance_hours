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
const validHour = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ] as const;
const validMinute = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59 ]

export type ValidDay = typeof validDays[number];
export type ValidMonth = typeof validMonths[number];
export type ValidHour = typeof validHour[number];
export type ValidMinute = typeof validMinute[number];