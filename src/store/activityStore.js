import { create } from "zustand";
import {
  getDb,
  deleteActivity as deleteActivityFromDb,
  createActivity as createActivityFromDb,
  createTimedTask as createTimedTaskFromDb,
  createFollowUpTask as createFollowUpTaskFromDb,
  createMultiTasks as createMultiTasksFromDb,
  createWeeklySchedule as createWeeklyScheduleFromDb,
  createIntervalSchedule as createIntervalScheduleFromDb,
} from "../api/database";

const useActivityStore = create((set, get) => ({
  activities: [],

  loadActivities: async () => {
    const result = await getDb().getAllAsync("SELECT * FROM activities");

    set({ activities: result });
  },

  deleteActivity: async (activity) => {
    await deleteActivityFromDb(activity);
    await get().loadActivities();
  },

  createActivity: async (activity) => {
    // 1. Create the main activity
    const newActivityId = await createActivityFromDb({
      title: activity.title,
      discribtion: activity.description,
      priority: activity.priority,
      type: activity.type,
      schedul: activity.schedule,
    });

    // // 2. Create the activity type data
    // switch (activity.type) {
    //   case "timed":
    //     await createTimedTaskFromDb(newActivityId.id, activity.typeData);
    //     break;

    //   case "follow_up":
    //     await createFollowUpTaskFromDb(newActivityId.id, activity.typeData);
    //     break;

    //   case "multi_activities":
    //     await createMultiTasksFromDb(newActivityId.id, activity.typeData);
    //     break;

    //   default:
    //     break;
    // }

    // 3. Create the schedule
    // switch (activity.schedule) {
    //   case "weekly":
    //     await createWeeklyScheduleFromDb(
    //       newActivityId.id,
    //       activity.scheduleData,
    //     );
    //     break;

    //   case "interval":
    //     await createIntervalScheduleFromDb(
    //       newActivityId.id,
    //       activity.scheduleData,
    //     );
    //     break;

    //   default:
    //     break;
    // }

    // 4. Refresh Zustand state
    await get().loadActivities();

    // 5. Return the newly created activity
    return newActivityId;
  },
}));

export default useActivityStore;
