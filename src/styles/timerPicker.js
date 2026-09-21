import theme from "./theme";

export const baseTimerPickerModalStyles = {
  theme: "dark",
  backgroundColor: theme.colors.surface,
  pickerItem: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
  },
  selectedPickerItem: {
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.xl,
  },
  pickerLabel: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
  },
  confirmButton: {
    color: theme.colors.background,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    overflow: "hidden",
    fontWeight: theme.fontWeights.bold,
  },
  cancelButton: {
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
};
