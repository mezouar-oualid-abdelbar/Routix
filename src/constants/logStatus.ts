export const LOG_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type LogStatus = (typeof LOG_STATUS)[keyof typeof LOG_STATUS];

export const LOG_STATUS_META: Record<LogStatus, { label: string }> = {
  [LOG_STATUS.PENDING]: { label: "Pending" },
  [LOG_STATUS.IN_PROGRESS]: { label: "In Progress" },
  [LOG_STATUS.COMPLETED]: { label: "Completed" },
};
