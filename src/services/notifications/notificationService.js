import * as Notifications from "expo-notifications";

// Thin wrapper around expo-notifications: permissions, default behavior,
// schedule/cancel. No activity knowledge lives here.
export async function ensurePermissions() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export function configureHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function schedule({ identifier, title, body, trigger, data }) {
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, data: data ?? {} },
    trigger,
  });
}

export async function cancelScheduled(ids) {
  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

export async function cancelByPrefix(prefix) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matching = scheduled
    .map((item) => item.identifier)
    .filter((id) => id && id.startsWith(prefix));
  await cancelScheduled(matching);
  return matching.length;
}

export const ACTIVITY_NOTIFICATION_PREFIX = "routix:activity:";
