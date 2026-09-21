import React, { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import useActivityStore from "../store/activityStore";
import { ReviewStep } from "../components/create-activity/ReviewStep";
import { AppButton } from "../components/common/AppButton";

export function ActivityDetailScreen({ navigation, route }) {
  const { activityId } = route.params ?? {};
  const activity = useActivityStore((state) =>
    state.activities.find((item) => String(item.id) === String(activityId)),
  );
  const softDeleteActivity = useActivityStore(
    (state) => state.softDeleteActivity,
  );

  useEffect(() => {
    if (!activity) navigation.goBack();
  }, [activity, navigation]);

  if (!activity) return null;

  const handleDelete = () => {
    Alert.alert(
      "Delete activity",
      `Delete "${activity.title}"? It will be hidden from your lists.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await softDeleteActivity(activity.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ReviewStep draft={activity} header="Activity details" />
      </ScrollView>

      <View style={styles.actionsRow}>
        <AppButton
          title="Edit"
          onPress={() =>
            navigation.navigate("EditActivityScreen", { activityId: activity.id })
          }
          style={styles.flex}
        />
        <AppButton title="Delete" onPress={handleDelete} variant="danger" style={styles.flex} />
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
  actionsRow: {
    flexDirection: "row",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  flex: {
    flex: 1,
  },
});

export default ActivityDetailScreen;
