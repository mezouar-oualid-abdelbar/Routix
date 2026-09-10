import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import { InfoForm } from "../components/InfoForm";
import { TypeForm } from "../components/TypeForm";
import { ScheduleForm } from "../components/ScheduleForm";
import { Time } from "../components/inputs/Time";
import { FormatTime as formatTime } from "../helpers/FormatTime";
import useCreateActivityDraft from "../store/createActivityDraft";
import useActivityStore from "../store/activityStore";
import { validateStep } from "../utils/validateActivity";

const switchPriority = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const switchType = [
  { label: "Normal", value: "normal" },
  { label: "Timed", value: "timed" },
  { label: "Follow up", value: "follow_up" },
  { label: "Multi activities", value: "multi_activities" },
];

const switchSchedule = [
  { label: "Normal", value: "normal" },
  { label: "Weekly", value: "weekly" },
  { label: "Interval", value: "interval" },
];

export function CreateActivityScreen({ navigation }) {
  //
  // local storage for  in-progress form
  //
  const draft = useCreateActivityDraft();
  const createActivity = useActivityStore((state) => state.createActivity);
  //
  //
  //
  const goNext = () => {
    const { isValid } = validateStep(draft.step, draft);
    if (!isValid) return; // later: show errors
    draft.setField("step", draft.step + 1);
  };

  const goBack = () => {
    draft.setField("step", draft.step - 1);
  };

  const handleSubmit = async () => {
    const { isValid } = validateStep(draft.step, draft);
    if (!isValid) return;

    await createActivity({
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      type: draft.type,
      typeData: draft.typeData,
      schedule: draft.schedule,
      scheduleData: draft.scheduleData,
      time: draft.time,
    });

    draft.resetDraft();
    navigation.goBack();
  };

  const renderStepDots = () => (
    <View style={styles.dotsRow}>
      {[1, 2, 3, 4].map((n) => (
        <View
          key={n}
          style={[styles.dot, n === draft.step && styles.dotActive]}
        />
      ))}
    </View>
  );

  const renderTypeDataPreview = (data) => {
    if (!data) return "—";
    if (Array.isArray(data)) {
      return data.map((item) => item.title || JSON.stringify(item)).join(", ");
    }
    if (typeof data === "object") {
      if (data.hours !== undefined || data.minutes !== undefined) {
        return `${data.hours || 0}h ${data.minutes || 0}m`;
      }
      return JSON.stringify(data);
    }
    return String(data);
  };

  const renderScheduleDataPreview = (data) => {
    if (!data) return "—";
    if (Array.isArray(data)) return data.join(", ");
    return String(data);
  };

  const renderStep1 = () => (
    <InfoForm
      title={draft.title}
      setTitle={(v) => draft.setField("title", v)}
      discribtion={draft.description}
      setDiscribtion={(v) => draft.setField("description", v)}
      priority={draft.priority}
      setPriority={(v) => draft.setField("priority", v)}
      switchPriority={switchPriority}
    />
  );

  const renderStep2 = () => (
    <TypeForm
      type={draft.type}
      switchType={switchType}
      setType={(v) => draft.setField("type", v)}
      typeData={draft.typeData}
      setTypeData={(v) => draft.setField("typeData", v)}
    />
  );

  const renderStep3 = () => (
    <>
      <ScheduleForm
        schedule={draft.schedule}
        switchSchedule={switchSchedule}
        setSchedule={(v) => draft.setField("schedule", v)}
        scheduleData={draft.scheduleData}
        setScheduleData={(v) => draft.setField("scheduleData", v)}
      />

      <Text style={styles.label}>Time</Text>
      <Time time={draft.time} setTime={(v) => draft.setField("time", v)} />
    </>
  );

  const renderStep4 = () => (
    <>
      <Text style={styles.reviewHeader}>Review</Text>

      <View style={styles.reviewCard}>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Title</Text>
          <Text style={styles.reviewValue}>{draft.title || "—"}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.reviewValue}>{draft.description || "—"}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Priority</Text>
          <Text style={styles.reviewValue}>{draft.priority}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Type</Text>
          <Text style={styles.reviewValue}>{draft.type}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Type Details</Text>
          <Text style={styles.reviewValue}>
            {renderTypeDataPreview(draft.typeData)}
          </Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Schedule</Text>
          <Text style={styles.reviewValue}>{draft.schedule}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Schedule Value</Text>
          <Text style={styles.reviewValue}>
            {renderScheduleDataPreview(draft.scheduleData)}
          </Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Time</Text>
          <Text style={styles.reviewValue}>
            {draft.time ? formatTime(draft.time) : "—"}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create activity</Text>
      {renderStepDots()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {draft.step === 1 && renderStep1()}
        {draft.step === 2 && renderStep2()}
        {draft.step === 3 && renderStep3()}
        {draft.step === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.navRow}>
        {draft.step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {draft.step < 4 ? (
          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
            <Text style={styles.nextButtonText}>Create</Text>
          </TouchableOpacity>
        )}
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
  dotsRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surface,
  },
  dotActive: { backgroundColor: theme.colors.primary },
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  reviewHeader: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  reviewRow: {
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  reviewLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  reviewValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginTop: 2,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  nextButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  nextButtonText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.md,
  },
});

export default CreateActivityScreen;
