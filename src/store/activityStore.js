import { create } from "zustand";
import { getDb } from "../api/database";
import { deleteActivity as deleteActivityFromDb } from "../api/database";

const useActivityStore = create((set, get) => ({
  activities: [],

  loadActivities: async () => {
    const result = await getDb().getAllAsync("SELECT * FROM activities");
    set({ activities: result });
  },

  deleteActivity: async (activity) => {
    await deleteActivityFromDb(activity);
    get().loadActivities();
  },
}));

export default useActivityStore;
