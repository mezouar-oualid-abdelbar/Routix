import React, { useState } from "react";
import { Text, TouchableOpacity, View, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../styles/theme";

const initialTasks = [
  { id: "1", title: "Laundry", at: "12:00 PM", completed: false },
  { id: "2", title: "Dry", at: null, completed: false },
  { id: "3", title: "Fold", at: null, completed: false },
];

export default function FollowUpActivityScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeAlarmIndex, setActiveAlarmIndex] = useState(0);
  const [isAlerting, setIsAlerting] = useState(true);
  
  // Modal states for setting the next alarm time
  const [modalVisible, setModalVisible] = useState(false);
  const [nextAlarmTimeInput, setNextAlarmTimeInput] = useState("");

  const currentTask = tasks[activeAlarmIndex];

  // Triggered when user presses Complete
  const handleCompletePress = () => {
    if (activeAlarmIndex + 1 < tasks.length) {
      setModalVisible(true);
    } else {
      completeTaskWithoutModal();
    }
  };

  const completeTaskWithoutModal = () => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated[activeAlarmIndex].completed = true;
      return updated;
    });

    setIsAlerting(false);
    if (activeAlarmIndex + 1 < tasks.length) {
      setActiveAlarmIndex((prev) => prev + 1);
      setIsAlerting(true);
    }
  };

  const handleConfirmNextTime = () => {
    setTasks((prevTasks) => {
      const updated = [...prevTasks];
      updated[activeAlarmIndex].completed = true;

      if (activeAlarmIndex + 1 < updated.length && nextAlarmTimeInput.trim() !== "") {
        updated[activeAlarmIndex + 1].at = nextAlarmTimeInput;
      }

      return updated;
    });

    setModalVisible(false);
    setNextAlarmTimeInput("");
    setIsAlerting(false);

    if (activeAlarmIndex + 1 < tasks.length) {
      setActiveAlarmIndex((prev) => prev + 1);
      setIsAlerting(true);
    }
  };

  // Only available when the alarm is actively ringing on screen
  const handleRemindIn5Min = () => {
    setIsAlerting(false);
  };

  // If all tasks are completed
  if (activeAlarmIndex >= tasks.length || tasks.every(t => t.completed)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center", padding: theme.spacing.xl }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.md }}>
          All Alarms Completed! ⏰✨
        </Text>
        <TouchableOpacity
          onPress={() => {
            setTasks(initialTasks);
            setActiveAlarmIndex(0);
            setIsAlerting(true);
          }}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
          }}
        >
          <Text style={{ color: theme.colors.textInverse, fontWeight: theme.fontWeights.bold, fontSize: theme.fontSizes.md }}>
            Reset Alarms
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
        
        {isAlerting ? (
          /* =========================================
             WHEN ALARM IS ACTIVELY RINGING ON SCREEN
          ========================================= */
          <View style={{ alignItems: "center", width: "100%" }}>
            <Text style={{ color: theme.colors.warning, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.bold, textTransform: "uppercase", marginBottom: theme.spacing.sm }}>
              🔔 Alarm Ringing
            </Text>

            <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.xxl * 1.2, fontWeight: theme.fontWeights.bold, textAlign: "center", marginBottom: theme.spacing.xs }}>
              {currentTask.title}
            </Text>

            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.xxl }}>
              Scheduled for: {currentTask.at || "Pending previous task"}
            </Text>

            {/* Complete & Remind in 5 min buttons */}
            <View style={{ width: "100%", gap: theme.spacing.md }}>
              <TouchableOpacity
                onPress={handleCompletePress}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.textInverse, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                  Complete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRemindIn5Min}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.error, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
                  Remind in 5 min
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* =========================================
             WHEN SNOOZED / NOT ALERTING
          ========================================= */
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.md }}>
              Snoozed / Awaiting Next Alarm...
            </Text>
            <TouchableOpacity
              onPress={() => setIsAlerting(true)}
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.lg,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Text style={{ color: theme.colors.textInverse, fontWeight: theme.fontWeights.bold }}>
                Open Alarm
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal to Set Time for the Next Alarm */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: theme.colors.overlay, justifyContent: "center", alignItems: "center", padding: theme.spacing.lg }}>
            <View style={{ width: "100%", backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border }}>
              <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.md }}>
                Set time for next task ({tasks[activeAlarmIndex + 1]?.title})
              </Text>

              <TextInput
                placeholder="e.g. 1:00 PM"
                placeholderTextColor={theme.colors.textSecondary}
                value={nextAlarmTimeInput}
                onChangeText={setNextAlarmTimeInput}
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.fontSizes.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  marginBottom: theme.spacing.lg,
                }}
              />

              <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
                <TouchableOpacity
                  onPress={handleConfirmNextTime}
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.primary,
                    paddingVertical: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.colors.textInverse, fontWeight: theme.fontWeights.bold }}>
                    Save & Continue
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    paddingVertical: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.colors.textSecondary, fontWeight: theme.fontWeights.bold }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}