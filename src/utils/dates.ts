// Local-day key used to group execution logs per scheduled occurrence.
export function todayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, count: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + count);
  return copy;
}

// Monday-start week containing `date`, as 7 Date objects (Mon..Sun).
export function getWeekDays(date: Date = new Date()): Date[] {
  const day = (date.getDay() + 6) % 7; // Mon=0 .. Sun=6
  const monday = addDays(date, -day);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// Every calendar day of `date`'s month.
export function getMonthDays(date: Date = new Date()): Date[] {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const days: Date[] = [];
  for (
    let d = first;
    d.getMonth() === first.getMonth();
    d = addDays(d, 1)
  ) {
    days.push(new Date(d));
  }
  return days;
}

// First day of each month of `date`'s year (Jan..Dec).
export function getYearMonths(date: Date = new Date()): Date[] {
  return Array.from(
    { length: 12 },
    (_, month) => new Date(date.getFullYear(), month, 1),
  );
}

export function isSameDay(a: Date, b: Date): boolean {
  return todayKey(a) === todayKey(b);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  );
}

export function startOfDay(date: Date | number): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// Whole days from the start of `from` to the start of `to`.
export function diffDays(from: Date | number, to: Date | number): number {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000,
  );
}

export function parseKey(key: string): Date {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, month - 1, day);
}
