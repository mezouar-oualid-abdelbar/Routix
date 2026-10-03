import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../styles/theme";
import ActivityCard from "../components/ActivityCard";
import { SafeAreaView } from "react-native-safe-area-context";
import useActivityStore from "../store/activityStore";

export default function ActivitiesScreen({ navigation }: { navigation: any }) {
  const activities = useActivityStore((state: any) => state.activities);

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
        contentContainerStyle={styles.listContent}
        data={activities}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            showSchedule={false}
            compact
            onPress={() =>
              navigation.navigate("ActivityDetailScreen", {
                activityId: item.id,
              })
            }
          />
        )}
        keyExtractor={(item: any) => String(item.id)}
      />

      <TouchableOpacity
        style={styles.createButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("CreateActivityScreen")}
      >
        <Ionicons name="add" size={28} color={theme.colors.textInverse} />
      </TouchableOpacity>
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
  listContent: {
    paddingBottom: theme.spacing.xxl + theme.spacing.md,
  },
  createButton: {
    position: "absolute",
    left: theme.spacing.md,
    bottom: theme.spacing.md,
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
