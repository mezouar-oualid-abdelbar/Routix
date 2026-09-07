import { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../styles/theme";

class FollowUpForm extends Component {
  state = {
    steps: [],
    stepTitle: "",
  };

  addStep = () => {
    const { stepTitle, steps } = this.state;
    if (!stepTitle.trim()) return;

    const newStep = { id: Date.now().toString(), title: stepTitle };
    this.setState({ steps: [...steps, newStep], stepTitle: "" });
  };

  removeStep = (id) => {
    this.setState((state) => ({
      steps: state.steps.filter((step) => step.id !== id),
    }));
  };

  render() {
    const { steps, stepTitle } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Steps</Text>
          <Text style={styles.count}>{steps.length}</Text>
        </View>

        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>

            <Text style={styles.stepTitle}>{step.title}</Text>

            {index < steps.length - 1 && (
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.textSecondary}
                style={styles.stepArrow}
              />
            )}

            <TouchableOpacity onPress={() => this.removeStep(step.id)}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Dry laundry"
            placeholderTextColor={theme.colors.textSecondary}
            value={stepTitle}
            onChangeText={(stepTitle) => this.setState({ stepTitle })}
            onSubmitEditing={this.addStep}
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.addButton} onPress={this.addStep}>
            <Ionicons name="add" size={22} color={theme.colors.background} />
          </TouchableOpacity>
        </View>

        {steps.length === 0 && (
          <Text style={styles.hint}>
            Add steps in order — you'll be reminded to move to the next one.
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  header: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  count: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
  },
  stepTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  stepArrow: {
    marginRight: theme.spacing.xs,
  },
  addRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.xs,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
  },
});

export default FollowUpForm;
