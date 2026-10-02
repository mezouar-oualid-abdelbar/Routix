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
import { ReviewStep } from "../components/create-activity/ReviewStep";
import {
  PRIORITY_OPTIONS,
  TYPE_OPTIONS,
  SCHEDULE_OPTIONS,
} from "../constants/activity";
import useActivityStore from "../store/activityStore";
import { validateStep } from "../utils/validateActivity";

const STEPS = [
  { id: 1, label: "Info" },
  { id: 2, label: "Type" },
  { id: 3, label: "Schedule" },
  { id: 4, label: "Review" },
];

export function EditActivityScreen({ navigation, route }) {
  const { activityId } = route.params ?? {};
  const activity = useActivityStore((state) =>
    state.activities.find((item) => String(item.id) === String(activityId)),
  );
  const updateActivity = useActivityStore((state) => state.updateActivity);

  const [step, setStep] = useState(1);
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

  const draft = {
    title,
    description,
    priority,
    type,
    typeData,
    schedule,
    scheduleData,
    time,
  };

  const handleSave = async () => {
    for (const s of [1, 2, 3]) {
      const result = validateStep(s, draft);
      if (!result.isValid) {
        setError(Object.values(result.errors)[0]);
        setStep(s); // jump to the step with the problem
        return;
      }
    }

    setError(null);

    await updateActivity({
      id: activity.id,
      ...draft,
      status: activity.status,
    });

    navigation.goBack();
  };

  const selectStep = (id) => {
    setError(null);
    setStep(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Edit activity</Text>

      <View style={styles.tabsRow}>
        {STEPS.map((s) => {
          const active = step === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => selectStep(s.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === 1 && (
          <InfoForm
            title={title}
            setTitle={setTitle}
            discribtion={description}
            setDiscribtion={setDescription}
            priority={priority}
            setPriority={setPriority}
            switchPriority={PRIORITY_OPTIONS}
          />
        )}

        {step === 2 && (
          <TypeForm
            type={type}
            switchType={TYPE_OPTIONS}
            setType={setType}
            typeData={typeData}
            setTypeData={setTypeData}
          />
        )}

        {step === 3 && (
          <>
            <ScheduleForm
              schedule={schedule}
              switchSchedule={SCHEDULE_OPTIONS}
              setSchedule={setSchedule}
              scheduleData={scheduleData}
              setScheduleData={setScheduleData}
            />
            <Text style={styles.label}>Time</Text>
            <Time time={time} setTime={setTime} />
          </>
        )}

        {step === 4 && <ReviewStep draft={draft} />}

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
  tabsRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },
  tabTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
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