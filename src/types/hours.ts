export type Hour = `${number}:${number}`

export type Day = {
  dayValue: `${number}/${number}`,
  hours: DayHours
}

export type DayHours = {
  in: Hour,
  out: Hour
  
}