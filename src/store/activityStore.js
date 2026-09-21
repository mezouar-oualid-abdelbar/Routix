import { create } from "zustand";
import {
  getActivities,
  getActivityById as getActivityByIdFromDb,
  createActivity as createActivityFromDb,
  updateActivity as updateActivityInDb,
  softDeleteActivity as softDeleteActivityInDb,
} from "../api/database";
import { getLogsForDate, getLastCompletedDates } from "../database/activityLogs";
import { todayKey } from "../utils/dates";
import { buildTodayEntries } from "../utils/todayEntries";
import {
  cancelActivityNotifications,
  syncActivityNotifications,
} from "../services/notifications/activityNotifications";

// Notification sync must never break the database flow (e.g. platforms
// without notification support), so failures are contained here.
async function syncNotificationsQuietly(task) {
  try {
    await task();
  } catch (error) {
    console.warn("Activity notification sync failed:", error);
  }
}

const useActivityStore = create((set, get) => ({
  activities: [],
  todayEntries: [],

  loadActivities: async () => {
    set({ activities: await getActivities() });
  },

  refreshToday: async (now = new Date()) => {
    const activities = await getActivities();
    const key = todayKey(now);
    const logs = await getLogsForDate(key);
    const logsByActivityId = {};
    logs.forEach((log) => {
      logsByActivityId[log.activityId] = log;
    });
    // Anchors exclude today: today's own completion must not hide the entry.
    const lastDoneByActivityId = await getLastCompletedDates(key);
    set({
      activities,
      todayEntries: buildTodayEntries(activities, logsByActivityId, now, lastDoneByActivityId),
    });
  },

  softDeleteActivity: async (activityId) => {
    await softDeleteActivityInDb(activityId);
    await get().loadActivities();
    await syncNotificationsQuietly(() => cancelActivityNotifications(activityId));
  },

  getActivityById: async (activityId) => {
    const cached = get().activities.find(
      (activity) => String(activity.id) === String(activityId),
    );
    if (cached) return cached;
    return getActivityByIdFromDb(activityId);
  },

  createActivity: async (activity) => {
    // Persist the full activity: info + type data + schedule data + time.
    const newActivityId = await createActivityFromDb({
      title: activity.title,
      description: activity.description,
      priority: activity.priority,
      type: activity.type,
      typeData: activity.typeData,
      schedule: activity.schedule,
      scheduleData: activity.scheduleData,
      time: activity.time,
    });

    // Refresh Zustand state
    await get().loadActivities();

    await syncNotificationsQuietly(() =>
      syncActivityNotifications({ ...activity, id: newActivityId.id }),
    );

    // Return the newly created activity
    return newActivityId;
  },

  updateActivity: async (activity) => {
    // Update the existing activity in place; the ID never changes.
    await updateActivityInDb({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      priority: activity.priority,
      type: activity.type,
      typeData: activity.typeData,
      schedule: activity.schedule,
      scheduleData: activity.scheduleData,
      time: activity.time,
      status: activity.status,
    });

    // Refresh Zustand state
    await get().loadActivities();

    await syncNotificationsQuietly(async () => {
      const fresh = await getActivityByIdFromDb(activity.id);
      await syncActivityNotifications(fresh);
    });
  },
}));

export default useActivityStore;
