import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialDraft = {
  step: 1,
  title: "",
  description: "",
  priority: "low",
  type: "normal",
  typeData: null,
  schedule: "normal",
  scheduleData: null,
  time: null,
};

const useCreateActivityDraft = create(
  persist(
    (set) => ({
      ...initialDraft,

      setField: (field, value) => set({ [field]: value }),

      resetDraft: () => set(initialDraft),
    }),
    {
      name: "create-activity-draft",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useCreateActivityDraft;
