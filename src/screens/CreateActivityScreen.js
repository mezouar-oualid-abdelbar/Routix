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
import { StepDots } from "../components/create-activity/StepDots";
import { ReviewStep } from "../components/create-activity/ReviewStep";
import {
  PRIORITY_OPTIONS,
  TYPE_OPTIONS,
  SCHEDULE_OPTIONS,
} from "../constants/activity";
import useCreateActivityDraft from "../store/createActivityDraft";
import useActivityStore from "../store/activityStore";
import { validateStep } from "../utils/validateActivity";

export function CreateActivityScreen({ navigation }) {
  const draft = useCreateActivityDraft();
  const createActivity = useActivityStore((state) => state.createActivity);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create activity</Text>
      <StepDots step={draft.step} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {draft.step === 1 && (
          <InfoForm
            title={draft.title}
            setTitle={(v) => draft.setField("title", v)}
            discribtion={draft.description}
            setDiscribtion={(v) => draft.setField("description", v)}
            priority={draft.priority}
            setPriority={(v) => draft.setField("priority", v)}
            switchPriority={PRIORITY_OPTIONS}
          />
        )}
        {draft.step === 2 && (
          <TypeForm
            type={draft.type}
            switchType={TYPE_OPTIONS}
            setType={(v) => draft.setField("type", v)}
            typeData={draft.typeData}
            setTypeData={(v) => draft.setField("typeData", v)}
          />
        )}
        {draft.step === 3 && (
          <>
            <ScheduleForm
              schedule={draft.schedule}
              switchSchedule={SCHEDULE_OPTIONS}
              setSchedule={(v) => draft.setField("schedule", v)}
              scheduleData={draft.scheduleData}
              setScheduleData={(v) => draft.setField("scheduleData", v)}
            />

            <Text style={styles.label}>Time</Text>
            <Time time={draft.time} setTime={(v) => draft.setField("time", v)} />
          </>
        )}
        {draft.step === 4 && <ReviewStep draft={draft} />}
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
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
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
