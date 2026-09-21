import React from "react";
import { Text, View, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import { formatTime } from "../../utils/formatTime";

function renderTypeDataPreview(data) {
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
}

function renderScheduleDataPreview(data) {
  if (!data) return "—";
  if (Array.isArray(data)) return data.join(", ");
  return String(data);
}

export function ReviewStep({ draft, header = "Review" }) {
  const rows = [
    { label: "Title", value: draft.title || "—" },
    { label: "Description", value: draft.description || "—" },
    { label: "Priority", value: draft.priority },
    { label: "Type", value: draft.type },
    { label: "Type Details", value: renderTypeDataPreview(draft.typeData) },
    { label: "Schedule", value: draft.schedule },
    {
      label: "Schedule Value",
      value: renderScheduleDataPreview(draft.scheduleData),
    },
    {
      label: "Time",
      value: draft.time ? formatTime(draft.time) : "—",
    },
  ];

  return (
    <>
      <Text style={styles.reviewHeader}>{header}</Text>
      <View style={styles.reviewCard}>
        {rows.map((row) => (
          <View key={row.label} style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{row.label}</Text>
            <Text style={styles.reviewValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});

export default ReviewStep;
