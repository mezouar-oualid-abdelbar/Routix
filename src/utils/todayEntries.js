import { isDueToday } from "./activityFilters";
import { LOG_STATUS } from "../constants/logStatus";
import { formatCountdown } from "./formatTime";

// Joins activity definitions with their log for a given day into the
// view-model Today renders. A missing log means "due, not started yet".
// lastDoneByActivityId maps activityId -> last completed YYYY-MM-DD and
// anchors interval schedules (rolling: due N+ days after last completion).
export function buildTodayEntries(
  activities,
  logsByActivityId,
  now = new Date(),
  lastDoneByActivityId = {},
) {
  return activities
    .filter((activity) =>
      isDueToday(activity, now, lastDoneByActivityId[activity.id] ?? null),
    )
    .map((activity) => {
      const log = logsByActivityId[activity.id] ?? null;
      return {
        activity,
        log,
        status: log?.status ?? LOG_STATUS.PENDING,
        progress: log?.progress ?? 0,
      };
    });
}

export function getProgressSummary(entry) {
  const { activity, log, progress } = entry;
  const data = log?.data ?? null;

  switch (activity.type) {
    case "timed": {
      const total = data?.totalSeconds ?? 0;
      const elapsed = data?.elapsedSeconds ?? 0;
      return {
        percent: progress,
        detail:
          total > 0
            ? `${formatCountdown(elapsed)} / ${formatCountdown(total)}`
            : null,
      };
    }

    case "follow_up": {
      const total = Array.isArray(activity.typeData)
        ? activity.typeData.length
        : 0;
      const done = Array.isArray(data?.completedStepIds)
        ? data.completedStepIds.length
        : 0;
      return { percent: progress, detail: `${done} / ${total} steps` };
    }

    case "multi_activities": {
      const total = Array.isArray(activity.typeData)
        ? activity.typeData.length
        : 0;
      const done = Array.isArray(data?.completedTaskIds)
        ? data.completedTaskIds.length
        : 0;
      return { percent: progress, detail: `${done} / ${total} tasks` };
    }

    default:
      return { percent: progress, detail: null };
  }
}
