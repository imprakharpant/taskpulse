import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as taskApi from '../api/tasks.api';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const PRIORITIES = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

const STATUSES = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const TaskFormScreen = ({ route, navigation }) => {
  const { projectId, task, isEditing } = route.params;

  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState(task?.status || 'PENDING');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.split('T')[0] : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Task title is required');
      return;
    }

    // Validate dueDate format if supplied
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      Alert.alert('Validation Error', 'Due date must be in YYYY-MM-DD format');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      };

      if (isEditing) {
        await taskApi.updateTask(task.id, payload);
      } else {
        await taskApi.createTask({
          ...payload,
          projectId,
        });
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Name input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Design wireframes"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
          />
        </View>

        {/* Description input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Additional details..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />
        </View>

        {/* Priority Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.chipRow}>
            {PRIORITIES.map((p) => {
              const isSelected = priority === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => setPriority(p.value)}
                  style={[styles.selectChip, isSelected && styles.selectChipActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.selectChipText, isSelected && styles.selectChipTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Status Selector (especially useful when editing) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.chipRow}>
            {STATUSES.map((s) => {
              const isSelected = status === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  onPress={() => setStatus(s.value)}
                  style={[styles.selectChip, isSelected && styles.selectChipActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.selectChipText, isSelected && styles.selectChipTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
          <View style={styles.inputIconWrapper}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="2026-12-31"
              placeholderTextColor={COLORS.textMuted}
              style={styles.iconInput}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveBtnText}>
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.medium,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  selectChip: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.semiBold,
  },
  selectChipTextActive: {
    color: '#ffffff',
  },
  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.xs,
  },
  iconInput: {
    flex: 1,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 15,
    ...FONTS.bold,
  },
});
