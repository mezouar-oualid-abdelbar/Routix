export function parseJson(value, fallback = null) {
  if (value == null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function toJson(value) {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
}
