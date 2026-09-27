import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';

const BACKGROUND_TASK_IDENTIFIER = 'background-task';
const LOG_KEY = 'bg_task_log';

// Register and create the task so that it is available also when the background task screen
// (a React component defined later in this example) is not visible.
// Note: This needs to be called in the global scope, not in a React component.
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const now = new Date().toISOString();

    // Persist the firing since console.log won't be visible in DevTools
    // when this runs in a detached/headless JS context.
    const existing = await AsyncStorage.getItem(LOG_KEY);
    const log = existing ? JSON.parse(existing) : [];
    log.push(now);
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(log));

    console.log(`Got background task call at date: ${now}`);
  } catch (error) {
    console.error('Failed to execute the background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

// 2. Register the task at some point in your app by providing the same name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundTaskAsync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
    minimumInterval: 15, // Android floor is 15 min regardless of value set below that
  });
}

// 3. Unregister the task by specifying the task name
// This will cancel any future background task calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

export default function BackgroundTaskScreen() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);
  const [fireLog, setFireLog] = useState([]);

  useEffect(() => {
    updateAsync();
  }, []);

  const updateAsync = async () => {
    const status = await BackgroundTask.getStatusAsync();
    setStatus(status);

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER);
    setIsRegistered(isRegistered);

    const logRaw = await AsyncStorage.getItem(LOG_KEY);
    const log = logRaw ? JSON.parse(logRaw) : [];
    setFireLog(log);
    console.log('BG TASK FIRE LOG:', log);
  };

  const toggle = async () => {
    if (!isRegistered) {
      await registerBackgroundTaskAsync();
    } else {
      await unregisterBackgroundTaskAsync();
    }
    await updateAsync();
  };

  const clearLog = async () => {
    await AsyncStorage.removeItem(LOG_KEY);
    setFireLog([]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{' '}
          <Text style={styles.boldText}>
            {status !== null ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      </View>

      <Button
        disabled={status === BackgroundTask.BackgroundTaskStatus.Restricted}
        title={isRegistered ? 'Cancel background task' : 'Schedule background task'}
        onPress={toggle}
      />
      <Button title="Check background task status" onPress={updateAsync} />
      <Button title="Clear fire log" onPress={clearLog} />

      <Text style={[styles.boldText, { marginTop: 20 }]}>
        Fire log ({fireLog.length}):
      </Text>
      <ScrollView style={styles.logContainer}>
        {fireLog.length === 0 ? (
          <Text>No firings recorded yet.</Text>
        ) : (
          fireLog
            .slice()
            .reverse()
            .map((timestamp, index) => <Text key={index}>{timestamp}</Text>)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  logContainer: {
    maxHeight: 200,
    width: '100%',
    marginTop: 8,
  },
});