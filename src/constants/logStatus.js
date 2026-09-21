export const LOG_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const LOG_STATUS_META = {
  [LOG_STATUS.PENDING]: { label: "Pending" },
  [LOG_STATUS.IN_PROGRESS]: { label: "In Progress" },
  [LOG_STATUS.COMPLETED]: { label: "Completed" },
};
