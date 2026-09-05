import { Component } from "react";
import { Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";
import SwitchSelector from "react-native-switch-selector";
import TimedForm from "../components/TimedForm";
import MultiActivitiesForm from "../components/MultiActivitiesForm";
import FollowUpForm from "../components/FollowUpForm";

class CreateActivityScreen extends Component {
  state = {
    title: "",
    discribtion: "",
    priority: "low",
    type: "normal",
    schedule: "normal",

    switchPriority: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],

    switchType: [
      { label: "Normal", value: "normal" },
      { label: "Timed", value: "timed" },
      { label: "Follow up", value: "follow_up" },
      { label: "Multi activities", value: "multi_activities" },
    ],

    switchSchedule: [
      { label: "One Time", value: "one_time" },
      { label: "Weekly", value: "weekly" },
      { label: "Interval", value: "interval" },
      { label: "After completion", value: "after_completion" },
    ],
  };

  renderTypeForm() {
    switch (this.state.type) {
      case "normal":
        return null;

      case "timed":
        return <TimedForm />;

      case "follow_up":
        return <FollowUpForm />;

      case "multi_activities":
        return <MultiActivitiesForm />;

      default:
        return null;
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>Create activity</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={this.state.title}
            onChangeText={(title) => this.setState({ title })}
            placeholder="Activity title"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={this.state.discribtion}
            onChangeText={(discribtion) => this.setState({ discribtion })}
            placeholder="Activity description"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />

          <Text style={styles.label}>Priority</Text>
          <SwitchSelector
            options={this.state.switchPriority}
            initial={0}
            onPress={(value) => this.setState({ priority: value })}
            buttonColor={theme.colors.primary}
            backgroundColor={theme.colors.surface}
            textColor={theme.colors.textSecondary}
            selectedTextStyle={{ color: theme.colors.textInverse }}
            style={styles.switch}
          />

          <Text style={styles.label}>Type</Text>
          <SwitchSelector
            options={this.state.switchType}
            initial={0}
            onPress={(value) => this.setState({ type: value })}
            buttonColor={theme.colors.primary}
            backgroundColor={theme.colors.surface}
            textColor={theme.colors.textSecondary}
            selectedTextStyle={{ color: theme.colors.textInverse }}
            style={styles.switch}
          />

          {/* Type-specific form */}
          {this.renderTypeForm()}

          <Text style={styles.label}>Scheduling</Text>
          <SwitchSelector
            options={this.state.switchSchedule}
            initial={0}
            onPress={(value) => this.setState({ schedule: value })}
            buttonColor={theme.colors.primary}
            backgroundColor={theme.colors.surface}
            textColor={theme.colors.textSecondary}
            selectedTextStyle={{ color: theme.colors.textInverse }}
            style={styles.switch}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
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
  label: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  switch: {
    marginBottom: theme.spacing.sm,
  },
});

export default CreateActivityScreen;
