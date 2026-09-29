import {
  ACTIVITY_NOTIFICATION_PREFIX,
  cancelByPrefix,
  ensurePermissions,
  schedule,
} from "./notificationService";
import { buildOccurrences } from "./activityTriggers";
import { getActivities, getActivityById } from "../../database/activities";
import { getLastCompletedDate, getLastCompletedDates } from "../../database/activityLogs";

const prefixFor = (activityId) =>
  `${ACTIVITY_NOTIFICATION_PREFIX}${activityId}:`;

// Deterministic identifiers: activity + occurrence. Re-syncing never
// duplicates and any occurrence can be cancelled individually.
const identifierFor = (activityId, occurrenceKey) =>
  `${prefixFor(activityId)}${occurrenceKey}`;

export async function syncActivityNotifications(
  activity,
  { skipCancel = false, lastDoneKey } = {},
) {
  if (!activity || activity.deletedAt != null) return;
  if (!skipCancel) await cancelByPrefix(prefixFor(activity.id));

  const anchor =
    lastDoneKey !== undefined
      ? lastDoneKey
      : await getLastCompletedDate(activity.id);
  const occurrences = buildOccurrences(activity, new Date(), anchor);
  if (occurrences.length === 0) return;
  if (!(await ensurePermissions())) return;

  await Promise.all(
    occurrences.map((occurrence) =>
      schedule({
        identifier: identifierFor(activity.id, occurrence.occurrenceKey),
        title: "🔔 Routix",
        body: `${activity.title}\nIt's time to start your activity.`,
        trigger: occurrence.trigger,
        data: { activityId: activity.id },
      }),
    ),
  );
}

export async function cancelActivityNotifications(activityId) {
  await cancelByPrefix(prefixFor(activityId));
}

// Full resync (app startup): clears stale schedules, then re-schedules
// every active activity that has a reminder time.
export async function syncAllActivityNotifications() {
  const activities = await getActivities();
  const withTime = activities.filter((activity) => activity.time != null);
  if (withTime.length === 0) return;
  if (!(await ensurePermissions())) return;

  const lastDoneByActivityId = await getLastCompletedDates();
  await cancelByPrefix(ACTIVITY_NOTIFICATION_PREFIX);
  await Promise.all(
    withTime.map((activity) =>
      syncActivityNotifications(activity, {
        skipCancel: true,
        lastDoneKey: lastDoneByActivityId[activity.id] ?? null,
      }),
    ),
  );
}

// Recompute one activity's alarms (e.g. right after it is completed,
// which moves a rolling interval anchor).
export async function resyncActivityNotifications(activityId) {
  const activity = await getActivityById(activityId);
  if (!activity) return;
  await syncActivityNotifications(activity);
}
