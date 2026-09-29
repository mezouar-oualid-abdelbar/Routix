import { useCallback, useEffect, useRef, useState } from "react";
import { getOrCreateActivityLog, updateActivityLog } from "../database/activityLogs";
import { resyncActivityNotifications } from "../services/notifications/activityNotifications";
import { LOG_STATUS } from "../constants/logStatus";

// Shared lifecycle for one activity on one day: loads (or lazily creates)
// today's log and exposes start / progress / complete actions.
// Type-specific progress math stays in the execution screens.
export function useActivityLog(activityId, logDate) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const logRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLog(null);
    logRef.current = null;

    if (activityId == null) {
      setLoading(false);
      return () => {
        alive = false;
      };
    }

    getOrCreateActivityLog(activityId, logDate)
      .then((loaded) => {
        if (alive) {
          logRef.current = loaded;
          setLog(loaded);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [activityId, logDate]);

  const persist = useCallback(async (patch) => {
    const current = logRef.current;
    if (!current) return null;
    const updated = await updateActivityLog(current.id, patch);
    if (updated) {
      logRef.current = updated;
      setLog(updated);
    }
    return updated;
  }, []);

  const start = useCallback(() => {
    const current = logRef.current;
    if (!current || current.status !== LOG_STATUS.PENDING) {
      return Promise.resolve(current);
    }
    return persist({
      status: LOG_STATUS.IN_PROGRESS,
      startedAt: current.startedAt ?? Date.now(),
      progress: current.progress ?? 0,
    });
  }, [persist]);

  const saveProgress = useCallback(
    (progress, data) => {
      const current = logRef.current;
      if (!current) return Promise.resolve(null);
      return persist({
        progress,
        data,
        status:
          current.status === LOG_STATUS.PENDING
            ? LOG_STATUS.IN_PROGRESS
            : current.status,
        startedAt: current.startedAt ?? Date.now(),
      });
    },
    [persist],
  );

  const complete = useCallback(
    (data) => {
      const current = logRef.current;
      if (!current) return Promise.resolve(null);
      const patch = {
        status: LOG_STATUS.COMPLETED,
        completedAt: Date.now(),
        progress: 100,
        startedAt: current.startedAt ?? Date.now(),
      };
      if (data !== undefined) patch.data = data;
      return persist(patch).then((updated) => {
        // A completion can move a rolling interval anchor: recompute alarms.
        resyncActivityNotifications(activityId).catch((error) =>
          console.warn("Alarm resync after completion failed:", error),
        );
        return updated;
      });
    },
    [persist, activityId],
  );

  return { log, loading, start, saveProgress, complete };
}

export default useActivityLog;
