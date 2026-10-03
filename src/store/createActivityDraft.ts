import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CreateActivityDraftState {
  step: number;
  title: string;
  description: string;
  priority: string;
  type: string;
  typeData: any;
  schedule: string;
  scheduleData: any;
  time: any;
  setField: (field: string, value: any) => void;
  resetDraft: () => void;
}

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

const useCreateActivityDraft = create<CreateActivityDraftState>()(
  persist(
    (set) => ({
      ...initialDraft,

      setField: (field, value) => set({ [field]: value } as Partial<CreateActivityDraftState>),

      resetDraft: () => set(initialDraft),
    }),
    {
      name: "create-activity-draft",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useCreateActivityDraft;
