// Local-day key used to group execution logs per scheduled occurrence.
export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date, count) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + count);
  return copy;
}

// Monday-start week containing `date`, as 7 Date objects (Mon..Sun).
export function getWeekDays(date = new Date()) {
  const day = (date.getDay() + 6) % 7; // Mon=0 .. Sun=6
  const monday = addDays(date, -day);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// Every calendar day of `date`'s month.
export function getMonthDays(date = new Date()) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const days = [];
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
export function getYearMonths(date = new Date()) {
  return Array.from(
    { length: 12 },
    (_, month) => new Date(date.getFullYear(), month, 1),
  );
}

export function isSameDay(a, b) {
  return todayKey(a) === todayKey(b);
}

export function isSameMonth(a, b) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  );
}

export function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// Whole days from the start of `from` to the start of `to`.
export function diffDays(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / 86400000);
}

export function parseKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, month - 1, day);
}
