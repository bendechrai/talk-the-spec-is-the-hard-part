export function toMinutes(hhmm: string): number {
  const [hoursRaw, minutesRaw] = hhmm.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  return hours * 60 + minutes;
}

export function slotLengthMinutes(start: string, end: string): number {
  return toMinutes(end) - toMinutes(start);
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}
