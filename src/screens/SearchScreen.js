import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import ActivityCard from "../components/ActivityCard";
import useActivityStore from "../store/activityStore";
import { searchActivities } from "../utils/searchActivities";

export default function SearchScreen({ navigation, route }) {
  const activities = useActivityStore((state) => state.activities);
  const loadActivities = useActivityStore((state) => state.loadActivities);
  const [query, setQuery] = useState(route?.params?.query ?? "");

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const results = useMemo(
    () => searchActivities(activities, query),
    [activities, query],
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="search for your activity"
        placeholderTextColor={theme.colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() =>
              navigation.navigate("ActivityDetailScreen", {
                activityId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.placeholder}>
            {query.trim() ? "No activities found" : "No activities yet"}
          </Text>
        }
      />
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
  searchBar: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },
});
