export function getExecutionRoute(activity) {
  switch (activity?.type) {
    case "timed":
      return {
        name: "TimedActivityScreen",
        params: { activityId: activity.id },
      };
    case "follow_up":
      return {
        name: "FollowUpActivityScreen",
        params: { activityId: activity.id },
      };
    case "multi_activities":
      return {
        name: "MultiActivityScreen",
        params: { activityId: activity.id },
      };
    case "normal":
    default:
      return {
        name: "NormalActivityScreen",
        params: { activityId: activity?.id, activityTitle: activity?.title },
      };
  }
}
