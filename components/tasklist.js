
import React from 'react';

import {
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';

import TaskItem from './taskitem';

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>
          No assignments found.
        </Text>
      }
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 30,
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    padding: 20,
  },
});
