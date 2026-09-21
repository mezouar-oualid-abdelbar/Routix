import { create } from "zustand";
import {
  getActivities,
  getActivityById as getActivityByIdFromDb,
  createActivity as createActivityFromDb,
  updateActivity as updateActivityInDb,
  updateActivityStatus as updateActivityStatusInDb,
  softDeleteActivity as softDeleteActivityInDb,
} from "../api/database";

const useActivityStore = create((set, get) => ({
  activities: [],

  loadActivities: async () => {
    set({ activities: await getActivities() });
  },

  softDeleteActivity: async (activityId) => {
    await softDeleteActivityInDb(activityId);
    await get().loadActivities();
  },

  getActivityById: async (activityId) => {
    const cached = get().activities.find(
      (activity) => String(activity.id) === String(activityId),
    );
    if (cached) return cached;
    return getActivityByIdFromDb(activityId);
  },

  setActivityStatus: async (activity, status) => {
    await updateActivityStatusInDb(activity.id, status);
    await get().loadActivities();
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
  },
}));

export default useActivityStore;
