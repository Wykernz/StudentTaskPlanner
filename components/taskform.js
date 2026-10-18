import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

import { isValidDeadline } from '../utils/taskhelper';

export default function TaskForm({ onAdd, saving }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit() {
    if (!title.trim() || !subject.trim() || !deadline.trim()) {
      Alert.alert(
        'Missing Information',
        'Enter a title, subject, and deadline.'
      );
      return;
    }

    if (!isValidDeadline(deadline.trim())) {
      Alert.alert(
        'Invalid Deadline',
        'Use a real date in YYYY-MM-DD format.'
      );
      return;
    }

    const success = await onAdd({
      title: title.trim(),
      subject: subject.trim(),
      deadline: deadline.trim(),
      description: description.trim(),
    });

    if (success) {
      setTitle('');
      setSubject('');
      setDeadline('');
      setDescription('');
      Keyboard.dismiss();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Assignment</Text>

      <TextInput
        style={styles.input}
        placeholder="Assignment title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Subject (e.g. Programming)"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Deadline: YYYY-MM-DD"
        value={deadline}
        onChangeText={setDeadline}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={[styles.button, saving && styles.disabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Saving...' : '+ Add Assignment'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff75',
    padding: 16,
    borderRadius: 14,
    marginBottom: 22,
  },
  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  description: {
    minHeight: 75,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 9,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});