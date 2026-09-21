import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import { InfoForm } from "../components/InfoForm";
import { TypeForm } from "../components/TypeForm";
import { ScheduleForm } from "../components/ScheduleForm";
import { Time } from "../components/inputs/Time";
import {
  PRIORITY_OPTIONS,
  TYPE_OPTIONS,
  SCHEDULE_OPTIONS,
} from "../constants/activity";
import useActivityStore from "../store/activityStore";
import { validateStep } from "../utils/validateActivity";

export function EditActivityScreen({ navigation, route }) {
  const { activityId } = route.params ?? {};
  const activity = useActivityStore((state) =>
    state.activities.find((item) => String(item.id) === String(activityId)),
  );
  const updateActivity = useActivityStore((state) => state.updateActivity);

  // Local form state prefilled from the existing activity (independent
  // from the create-activity draft so an in-progress creation is kept).
  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [priority, setPriority] = useState(activity?.priority ?? "low");
  const [type, setType] = useState(activity?.type ?? "normal");
  const [typeData, setTypeData] = useState(activity?.typeData ?? null);
  const [schedule, setSchedule] = useState(activity?.schedule ?? "normal");
  const [scheduleData, setScheduleData] = useState(
    activity?.scheduleData ?? null,
  );
  const [time, setTime] = useState(activity?.time ?? null);
  const [error, setError] = useState(null);

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Activity not found.</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    const draft = { title, type, typeData, schedule, scheduleData };

    const step1 = validateStep(1, draft);
    if (!step1.isValid) {
      setError(Object.values(step1.errors)[0]);
      return;
    }
    const step2 = validateStep(2, draft);
    if (!step2.isValid) {
      setError(Object.values(step2.errors)[0]);
      return;
    }
    const step3 = validateStep(3, draft);
    if (!step3.isValid) {
      setError(Object.values(step3.errors)[0]);
      return;
    }

    setError(null);

    // Update in place; the activity ID stays the same.
    await updateActivity({
      id: activity.id,
      title,
      description,
      priority,
      type,
      typeData,
      schedule,
      scheduleData,
      time,
      status: activity.status,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Edit activity</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <InfoForm
          title={title}
          setTitle={setTitle}
          discribtion={description}
          setDiscribtion={setDescription}
          priority={priority}
          setPriority={setPriority}
          switchPriority={PRIORITY_OPTIONS}
        />

        <TypeForm
          type={type}
          switchType={TYPE_OPTIONS}
          setType={setType}
          typeData={typeData}
          setTypeData={setTypeData}
        />

        <ScheduleForm
          schedule={schedule}
          switchSchedule={SCHEDULE_OPTIONS}
          setSchedule={setSchedule}
          scheduleData={scheduleData}
          setScheduleData={setScheduleData}
        />

        <Text style={styles.label}>Time</Text>
        <Time time={time} setTime={setTime} />

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  scrollContent: { paddingBottom: theme.spacing.lg },
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.md,
  },
  actionsRow: {
    paddingVertical: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  saveButtonText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.md,
  },
});

export default EditActivityScreen;
