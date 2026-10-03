import React from "react";
import { Text, View, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import { LOG_STATUS, LOG_STATUS_META } from "../../constants/logStatus";

const STATUS_COLORS: Record<string, string> = {
  [LOG_STATUS.PENDING]: theme.colors.textSecondary,
  [LOG_STATUS.IN_PROGRESS]: theme.colors.info,
  [LOG_STATUS.COMPLETED]: theme.colors.success,
};

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? STATUS_COLORS[LOG_STATUS.PENDING];
  const label = (LOG_STATUS_META as Record<string, { label: string }>)[status]?.label ?? status;

  return (
    <View style={[styles.badge, { backgroundColor: withAlpha(color, 0.15) }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.round,
  },
  label: {
    fontSize: 11,
    fontWeight: theme.fontWeights.bold,
  },
});

export default StatusBadge;
