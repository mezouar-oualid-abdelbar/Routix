export function validateStep(step, draft) {
  const errors = {};

  if (step === 1) {
    if (!draft.title.trim()) {
      errors.title = "Title is required";
    }
  }

  if (step === 2) {
    if (
      draft.type === "follow_up" &&
      (!draft.typeData || draft.typeData.length === 0)
    ) {
      errors.typeData = "Add at least one step";
    }
    if (
      draft.type === "multi_activities" &&
      (!draft.typeData || draft.typeData.length === 0)
    ) {
      errors.typeData = "Add at least one activity";
    }
  }

  if (step === 3) {
    if (
      draft.schedule === "weekly" &&
      (!draft.scheduleData || draft.scheduleData.length === 0)
    ) {
      errors.scheduleData = "Select at least one day";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
