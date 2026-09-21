import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { CompletionView } from "../components/common/CompletionView";
import { ExecutionShell } from "../components/execution/ExecutionShell";
import useActivityStore from "../store/activityStore";
import { useActivityLog } from "../hooks/useActivityLog";
import { todayKey } from "../utils/dates";
import { LOG_STATUS } from "../constants/logStatus";

export default function FollowUpActivityScreen({ navigation, route }) {
  const { activityId } = route?.params ?? {};
  const activity = useActivityStore((state) =>
    activityId == null
      ? undefined
      : state.activities.find((item) => String(item.id) === String(activityId)),
  );

  const { log, loading, start, saveProgress, complete } = useActivityLog(
    activity?.id,
    todayKey(),
  );

  const steps = Array.isArray(activity?.typeData) ? activity.typeData : [];
  const completedIds = log?.data?.completedStepIds ?? [];
  const nextIndex = steps.findIndex((step) => !completedIds.includes(step.id));

  if (!activity) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Activity not found.</Text>
        <AppButton title="Back" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    );
  }

  if (!loading && log?.status === LOG_STATUS.COMPLETED) {
    return (
      <CompletionView
        title="All Steps Completed! 🎉"
        buttonLabel="Back"
        onPress={() => navigation.goBack()}
      />
    );
  }

  const handleCompleteStep = (stepId) => {
    const updated = [...completedIds, stepId];
    const progress = Math.round((updated.length / steps.length) * 100);
    if (updated.length >= steps.length) {
      complete({ completedStepIds: updated });
    } else {
      saveProgress(progress, { completedStepIds: updated });
    }
  };

  return (
    <ExecutionShell
      title={activity.title}
      subtitle={`Follow up • ${steps.length} steps`}
      status={log?.status ?? LOG_STATUS.PENDING}
      progress={log?.progress ?? 0}
    >
      {loading ? (
        <View style={styles.center}>
          <Text style={styles.hint}>Loading…</Text>
        </View>
      ) : log?.status === LOG_STATUS.PENDING ? (
        <View style={styles.center}>
          <Text style={styles.hint}>
            Complete the steps in order. Your progress is saved automatically.
          </Text>
          <AppButton title="Start" onPress={() => start()} style={styles.startButton} />
        </View>
      ) : (
        <View style={styles.list}>
          {steps.map((step, index) => {
            const isDone = completedIds.includes(step.id);
            const isNext = index === nextIndex;
            return (
              <View
                key={step.id}
                style={[styles.stepRow, !isDone && !isNext && styles.stepLocked]}
              >
                <View
                  style={[styles.stepNumber, isDone && styles.stepNumberDone]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color={theme.colors.textInverse} />
                  ) : (
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  )}
                </View>
                <Text style={[styles.stepTitle, isDone && styles.stepTitleDone]}>
                  {step.title}
                </Text>
                {isNext && (
                  <AppButton
                    title="Complete"
                    onPress={() => handleCompleteStep(step.id)}
                    style={styles.stepButton}
                  />
                )}
              </View>
            );
          })}
        </View>
      )}

      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={styles.backButton}
      />
    </ExecutionShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  fallbackText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  startButton: {
    paddingHorizontal: theme.spacing.xl,
  },
  list: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  stepLocked: {
    opacity: 0.5,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberDone: {
    backgroundColor: theme.colors.primary,
  },
  stepNumberText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
  },
  stepTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  stepTitleDone: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  stepButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});
