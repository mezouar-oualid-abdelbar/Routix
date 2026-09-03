import { create } from "zustand";
import { getDb } from "../api/database";

const useActivityStore = create((set) => ({
  activities: [],

  loadActivities: async () => {
    const result = await getDb().getAllAsync("SELECT * FROM activities");
    set({ activities: result });
  },

  // addActivity: (activity) =>
  //   set((state) => ({ activities: [...state.activities, activity] })),

  // deleteActivity: (id) =>
  //   set((state) => ({
  //     activities: state.activities.filter((a) => a.id !== id),
  //   })),
}));

export default useActivityStore;
