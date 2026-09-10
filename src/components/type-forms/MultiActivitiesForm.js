import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SwitchSelector from "react-native-switch-selector";
import { TimerPicker } from "react-native-timer-picker";
import theme from "../../styles/theme";

export function MultiActivitiesForm({ typeData, setTypeData }) {
  const tasks = Array.isArray(typeData) ? typeData : [];

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("normal");
  const [activityTitle, setActivityTitle] = useState("");
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 30,
    seconds: 0,
  });

  const switchType = [
    { label: "Normal", value: "normal" },
    { label: "Timed", value: "timed" },
  ];

  const handleSave = () => {
    if (!activityTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: activityTitle.trim(),
      type,
      duration: type === "timed" ? duration : null,
    };

    const updatedTasks = [...tasks, newTask];
    setTypeData(updatedTasks);

    // Reset modal form state
    setShowModal(false);
    setActivityTitle("");
    setType("normal");
    setDuration({ hours: 0, minutes: 30, seconds: 0 });
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTypeData(updatedTasks);
  };

  const renderTimeInput = () => {
    if (type === "normal") return null;

    return (
      <View style={styles.timerWrapper}>
        <TimerPicker
          initialValue={duration}
          onDurationChange={setDuration}
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
  };

  const renderModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add Activity</Text>

          <TextInput
            style={styles.input}
            placeholder="Activity name"
            placeholderTextColor={theme.colors.textSecondary}
            value={activityTitle}
            onChangeText={setActivityTitle}
          />

          <SwitchSelector
            options={switchType}
            initial={0}
            onPress={(value) => setType(value)}
            buttonColor={theme.colors.primary}
            backgroundColor={theme.colors.surface}
            textColor={theme.colors.textSecondary}
            selectedTextStyle={{ color: theme.colors.textInverse }}
            style={styles.switch}
          />

          {renderTimeInput()}

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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

          {task.type === "timed" && task.duration && (
            <Text style={styles.taskDuration}>
              {task.duration.hours ? `${task.duration.hours}h ` : ""}
              {task.duration.minutes ? `${task.duration.minutes}m ` : ""}
              {task.duration.seconds ? `${task.duration.seconds}s` : ""}
            </Text>
          )}

          <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="add" size={18} color={theme.colors.primary} />
        <Text style={styles.addButtonText}>Add Activity</Text>
      </TouchableOpacity>

      {renderModal()}
    </View>
  );
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
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
