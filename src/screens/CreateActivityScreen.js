import React, { useState } from "react";
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
import { FormatTime as formatTime } from "../utiles/FormatTime";
export function CreateActivityScreen() {
  const [step, setStep] = useState(1);

  // Info Step
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const switchPriority = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  // Type Step
  const [type, setType] = useState("normal");
  const [typeData, setTypeData] = useState(null);
  const switchType = [
    { label: "Normal", value: "normal" },
    { label: "Timed", value: "timed" },
    { label: "Follow up", value: "follow_up" },
    { label: "Multi activities", value: "multi_activities" },
  ];

  // Schedule Step
  const [schedule, setSchedule] = useState("normal");
  const [scheduleData, setScheduleData] = useState(null);
  const switchSchedule = [
    { label: "Normal", value: "normal" },
    { label: "Weekly", value: "weekly" },
    { label: "Interval", value: "interval" },
  ];

  // Time Step
  const [time, setTime] = useState(null);

  const goNext = () => {
    if (step === 1 && !title.trim()) return;
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setStep((prev) => prev - 1);
  };

  const submitActivity = () => {
    console.log("Submitting:", {
      title,
      description,
      priority,
      type,
      typeData,
      schedule,
      scheduleData,
      time,
    });
    // DB insert wiring comes next
  };

  const renderStepDots = () => {
    return (
      <View style={styles.dotsRow}>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={[styles.dot, n === step && styles.dotActive]} />
        ))}
      </View>
    );
  };

  const renderTypeDataPreview = (data) => {
    if (!data) return "—";
    if (typeof data === "object") {
      if (data.hours !== undefined || data.minutes !== undefined) {
        return `${data.hours || 0}h ${data.minutes || 0}m`;
      }
      return JSON.stringify(data);
    }
    return String(data);
  };

  const renderStep1 = () => (
    <InfoForm
      title={title}
      setTitle={setTitle}
      discribtion={description}
      setDiscribtion={setDescription}
      priority={priority}
      setPriority={setPriority}
      switchPriority={switchPriority}
    />
  );

  const renderStep2 = () => (
    <TypeForm
      type={type}
      switchType={switchType}
      setType={setType}
      typeData={typeData}
      setTypeData={setTypeData}
    />
  );

  const renderStep3 = () => (
    <>
      <ScheduleForm
        schedule={schedule}
        switchSchedule={switchSchedule}
        setSchedule={setSchedule}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
      />

      <Text style={styles.label}>Time</Text>
      <Time time={time} setTime={setTime} />
    </>
  );

  const renderStep4 = () => (
    <>
      <Text style={styles.reviewHeader}>Review</Text>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Title</Text>
        <Text style={styles.reviewValue}>{title || "—"}</Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Description</Text>
        <Text style={styles.reviewValue}>{description || "—"}</Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Priority</Text>
        <Text style={styles.reviewValue}>{priority}</Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Type</Text>
        <Text style={styles.reviewValue}>{type}</Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Type Details</Text>
        <Text style={styles.reviewValue}>
          {renderTypeDataPreview(typeData)}
        </Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Schedule</Text>
        <Text style={styles.reviewValue}>{schedule}</Text>
      </View>

      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Time</Text>
        <Text style={styles.reviewValue}>{time ? formatTime(time) : "—"}</Text>
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
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.navRow}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {step < 4 ? (
          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={submitActivity}>
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
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
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
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
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
  reviewRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
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
