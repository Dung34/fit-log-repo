const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toIsoDateString(new Date());
}

export function parseDate(input: string): string {
  if (!ISO_DATE_PATTERN.test(input)) {
    throw new Error(`Invalid date format: ${input}`);
  }

  const [year, month, day] = input.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid date: ${input}`);
  }

  return input;
}

export function formatDate(iso: string): string {
  const validDate = parseDate(iso);
  const [year, month, day] = validDate.split("-").map(Number);

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function addDays(iso: string, days: number): string {
  parseDate(iso);
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toIsoDateString(date);
}
