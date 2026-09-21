import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../styles/theme";
import { AppButton } from "../components/common/AppButton";
import { CompletionView } from "../components/common/CompletionView";
import useActivityStore from "../store/activityStore";

export default function NormalActivityScreen({ navigation, route }) {
  const [isDone, setIsDone] = useState(false);
  const { activityId, activityTitle } = route?.params ?? {};
  const storedTitle = useActivityStore((state) =>
    activityId == null
      ? undefined
      : state.activities.find((item) => String(item.id) === String(activityId))?.title,
  );
  const title = storedTitle ?? activityTitle ?? "Activity";

  if (isDone) {
    return (
      <CompletionView
        title="Activity Complete! 🎉"
        buttonLabel="Back to Activities"
        onPress={() => navigation.goBack()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.taskTitle}>
          {title}
        </Text>
        <Text style={styles.standardLabel}>
          Standard Activity
        </Text>
      </View>

      <View style={styles.controlsRow}>
        <AppButton
          title="Done"
          onPress={() => setIsDone(true)}
          style={styles.flex}
        />
        <AppButton
          title="Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.flex}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  standardLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  controlsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  flex: {
    flex: 1,
  },
});
