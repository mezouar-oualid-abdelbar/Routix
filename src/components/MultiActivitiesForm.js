import { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SwitchSelector from "react-native-switch-selector";
import { TimerPicker } from "react-native-timer-picker";
import theme from "../styles/theme";

class MultiActivitiesForm extends Component {
  state = {
    tasks: [],
    showModal: false,
    type: "normal",
    activity_title: "",
    duration: { hours: 0, minutes: 30 },
    switchType: [
      { label: "Normal", value: "normal" },
      { label: "Timed", value: "timed" },
    ],
  };

  handleSave = () => {
    const { activity_title, type, duration, tasks } = this.state;
    if (!activity_title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: activity_title,
      type,
      duration,
    };

    this.setState({
      tasks: [...tasks, newTask],
      showModal: false,
      activity_title: "",
      type: "normal",
    });
  };

  renderTimeInput() {
    const { type, duration } = this.state;
    if (type === "normal") {
      return null;
    }

    return (
      <View style={styles.timerWrapper}>
        <TimerPicker
          hideSeconds
          initialValue={duration}
          onDurationChange={(duration) => this.setState({ duration })}
          styles={{
            theme: "dark",
            backgroundColor: theme.colors.background,
            pickerItem: {
              color: theme.colors.textSecondary,
              fontSize: theme.fontSizes.md,
            },
            selectedPickerItem: {
              color: theme.colors.text,
              fontWeight: theme.fontWeights.bold,
            },
            pickerLabel: {
              color: theme.colors.primary,
              fontSize: theme.fontSizes.sm,
            },
          }}
        />
      </View>
    );
  }

  renderTypeForm() {
    const { showModal } = this.state;
    if (!showModal) return null;

    return (
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Add Activity</Text>

        <TextInput
          style={styles.input}
          placeholder="activity name"
          placeholderTextColor={theme.colors.textSecondary}
          value={this.state.activity_title}
          onChangeText={(activity_title) => this.setState({ activity_title })}
        />

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

        {this.renderTimeInput()}

        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => this.setState({ showModal: false })}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={this.handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { tasks } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Activities</Text>
          <Text style={styles.count}>{tasks.length}</Text>
        </View>

        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <Ionicons
              name={
                task.type === "timed"
                  ? "time-outline"
                  : "checkmark-circle-outline"
              }
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.type === "timed" && (
              <Text style={styles.taskDuration}>
                {task.duration.hours}h {task.duration.minutes}m
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => this.setState({ showModal: true })}
        >
          <Ionicons name="add" size={18} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Add Activity</Text>
        </TouchableOpacity>

        {this.renderTypeForm()}
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
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  taskTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  taskDuration: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.medium,
  },
  modalCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  switch: {
    marginBottom: theme.spacing.sm,
  },
  timerWrapper: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  cancelButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  saveButtonText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeights.bold,
  },
});

export default MultiActivitiesForm;
