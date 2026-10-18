import React, { useEffect, useState, useMemo } from 'react';

import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  initDatabase,
  getTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
} from './database/database';

import TaskForm from './components/taskform';
import TaskItem from './components/taskitem';

import {
  sortTasks,
  filterTasks,
} from './utils/taskhelper';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [subject, setSubject] = useState('All');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize the database when the app opens.
  useEffect(() => {
    async function startApp() {
      try {
        await initDatabase();
        await refreshTasks();
      } catch (error) {
        Alert.alert('Database Error', error.message);
      } finally {
        setLoading(false);
      }
    }

    startApp();
  }, []);

  // Read the latest tasks from SQLite.
  async function refreshTasks() {
    const savedTasks = await getTasks();
    setTasks(savedTasks);
  }

  // Add a new assignment.
  async function handleAdd(task) {
    setSaving(true);

    try {
      await addTask(task);
      await refreshTasks();
      return true;
    } catch (error) {
      Alert.alert('Save Error', error.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  // Toggle between pending and completed.
  async function handleToggle(task) {
    try {
      const newStatus = task.completed === 1 ? 0 : 1;

      await updateTaskStatus(task.id, newStatus);
      await refreshTasks();
    } catch (error) {
      Alert.alert('Update Error', error.message);
    }
  }

  // Confirm before deleting an assignment.
  function handleDelete(id) {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
              await refreshTasks();
            } catch (error) {
              Alert.alert('Delete Error', error.message);
            }
          },
        },
      ]
    );
  }

  // Create the subject filter options (memoized).
  const subjects = useMemo(
    () => ['All', ...new Set(tasks.map((task) => task.subject))],
    [tasks]
  );

  // Sort and filter tasks before displaying them.
  const visibleTasks = filterTasks(
    sortTasks(tasks),
    filter,
    subject
  );

  // Count pending assignments.
  const pendingCount = tasks.filter(
    (task) => task.completed === 0
  ).length;

  // Count completed assignments.
  const completedCount = tasks.filter(
    (task) => task.completed === 1
  ).length;

  // Show loading screen while database is starting.
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.loadingText}>
          Loading assignments...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}

        // Everything above the task list.
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>
              Student Task Planner
            </Text>

            <Text style={styles.subtitle}>
              Organize your school assignments.
            </Text>

            {/* Pending and completed counters */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.number}>{pendingCount}</Text>
                <Text style={styles.summaryLabel}>Pending</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.number}>{completedCount}</Text>
                <Text style={styles.summaryLabel}>Completed</Text>
              </View>
            </View>

            {/* Form for adding a task */}
            <TaskForm onAdd={handleAdd} saving={saving} />

            <Text style={styles.sectionTitle}>
              Your Assignments
            </Text>

            {/* Pending / Completed filter */}
            <View style={styles.filterRow}>
              {['All', 'Pending', 'Completed'].map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setFilter(option)}
                  style={[
                    styles.filterButton,
                    filter === option && styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === option && styles.activeFilterText,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Filter by subject</Text>

            {/* Subject filter */}
            <View style={styles.subjectRow}>
              {subjects.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setSubject(option)}
                  style={[
                    styles.subjectButton,
                    subject === option && styles.activeSubject,
                  ]}
                >
                  <Text
                    style={[
                      styles.subjectText,
                      subject === option && styles.activeSubjectText,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }

        // Message when there are no tasks.
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No assignments found. Add your first task above!
          </Text>
        }

        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#64748B',
  },

  listContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#172554',
  },

  subtitle: {
    color: '#64748B',
    marginTop: 6,
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },

  summaryCard: {
    flex: 1,
    padding: 17,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  number: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  summaryLabel: {
    color: '#64748B',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 12,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  filterButton: {
    flex: 1,
    alignItems: 'center',
    padding: 11,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
  },

  activeFilter: {
    backgroundColor: '#2563EB',
  },

  filterText: {
    color: '#475569',
    fontWeight: '600',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  label: {
    color: '#64748B',
    marginBottom: 8,
  },

  subjectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  subjectButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  activeSubject: {
    backgroundColor: '#bdc8e0',
  },

  subjectText: {
    color: '#475569',
    fontSize: 12,
  },

  activeSubjectText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    paddingVertical: 25,
  },
});