import React from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { isOverdue } from '../utils/taskhelper';

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}) {
  const overdue = isOverdue(task);

  return (
    <View style={styles.card}>
      <View style={styles.row}>

        {/* Checkbox */}
        <Pressable
          style={[
            styles.checkbox,
            task.completed === 1 && styles.checked,
          ]}
          onPress={() => onToggle(task)}
        >
          <Text style={styles.checkText}>
            {task.completed === 1 ? '✓' : ''}
          </Text>
        </Pressable>

        {/* Task information */}
        <View style={styles.details}>
          <Text
            style={[
              styles.title,
              task.completed === 1 && styles.completedTitle,
            ]}
          >
            {task.title}
          </Text>

          <Text style={styles.subject}>{task.subject}</Text>

          <Text
            style={[
              styles.deadline,
              overdue && styles.overdue,
            ]}
          >
            {overdue ? 'Overdue: ' : 'Due: '}
            {task.deadline}
          </Text>

          {task.description ? (
            <Text style={styles.description}>
              {task.description}
            </Text>
          ) : null}
        </View>

        {/* Delete button */}
        <Pressable
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#94A3B8',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },

  checkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  details: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  completedTitle: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },

  subject: {
    color: '#2563EB',
    marginTop: 5,
  },

  deadline: {
    color: '#64748B',
    marginTop: 6,
    fontSize: 12,
  },

  overdue: {
    color: '#DC2626',
    fontWeight: 'bold',
  },

  description: {
    color: '#64748B',
    marginTop: 8,
    lineHeight: 20,
  },

  deleteButton: {
    padding: 4,
  },

  deleteText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
});