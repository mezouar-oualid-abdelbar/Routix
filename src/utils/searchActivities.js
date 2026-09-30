// Case-insensitive match against title + description.
// Empty query returns everything (deleted already excluded upstream).
export function searchActivities(activities, query) {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return activities ?? [];
  return (activities ?? []).filter((activity) => {
    const title = (activity.title ?? "").toLowerCase();
    const description = (activity.description ?? "").toLowerCase();
    return title.includes(q) || description.includes(q);
  });
}
