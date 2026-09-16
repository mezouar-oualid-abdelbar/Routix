import React, { Component } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import theme from "../styles/theme";
import ActivityCard from "../components/ActivityCard";
import { SafeAreaView } from "react-native-safe-area-context";
import useActivityStore from "../store/activityStore";

export default function ActivitiesScreen({ navigation }) {
  const activities = useActivityStore((state) => state.activities);
  const deleteActivity = useActivityStore((state) => state.deleteActivity);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Activities</Text>

      <TextInput
        style={styles.searchBar}
        placeholderTextColor={theme.colors.textSecondary}
        onFocus={() => navigation.navigate("SearchScreen")}
        placeholder="search for your activity"
      />

      <FlatList
        style={styles.list}
        data={activities}
        renderItem={({ item }) => (
          <ActivityCard activity={item}  onPress={()=>{navigation.navigate("FollowUpActivityScreen")}} />
        )}
        keyExtractor={(item) => String(item.id)}
      />

      <Button
        color={theme.colors.primary}
        title="create activity"
        onPress={() => navigation.navigate("CreateActivityScreen")}
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
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  list: {
    flex: 1,
  },
});
