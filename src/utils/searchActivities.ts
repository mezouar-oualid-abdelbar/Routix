import { Activity } from "../database/activities";

// Case-insensitive match against title + description.
// Empty query returns everything (deleted already excluded upstream).
export function searchActivities(
  activities: Activity[] | null | undefined,
  query: string | null | undefined,
): Activity[] {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return activities ?? [];
  return (activities ?? []).filter((activity) => {
    const title = (activity.title ?? "").toLowerCase();
    const description = (activity.description ?? "").toLowerCase();
    return title.includes(q) || description.includes(q);
  });
}
