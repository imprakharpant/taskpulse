import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, PRIORITY_CONFIG, TASK_STATUS_CONFIG } from '../../theme';

export const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = !isCompleted && task.dueDate && new Date(task.dueDate) < new Date();
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
  const statusCfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.PENDING;

  return (
    <View style={[styles.card, isOverdue && styles.cardOverdue]}>
      <View style={styles.topRow}>
        {/* Toggle Complete Checkbox */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleStatus(task)}
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        >
          {isCompleted && <Ionicons name="checkmark" size={14} color="#ffffff" />}
        </TouchableOpacity>

        {/* Task Title & Description */}
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, isCompleted && styles.titleCompleted]}
            numberOfLines={2}
          >
            {task.name}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
        </View>

        {/* Actions Menu (Edit / Delete) */}
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionBtn}>
              <Ionicons name="pencil-outline" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={() => onDelete(task)} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Meta Row: Priority, Due Date, Status */}
      <View style={styles.metaRow}>
        <View style={styles.leftTags}>
          {/* Priority */}
          <View style={[styles.tag, { backgroundColor: priorityCfg.bg, borderColor: priorityCfg.border }]}>
            <Text style={[styles.tagText, { color: priorityCfg.color }]}>{priorityCfg.label}</Text>
          </View>

          {/* Status */}
          <View style={[styles.tag, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
            <Text style={[styles.tagText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* Due date */}
        {task.dueDate ? (
          <View style={styles.dueContainer}>
            <Ionicons
              name="time-outline"
              size={13}
              color={isOverdue ? COLORS.danger : COLORS.textMuted}
            />
            <Text
              style={[
                styles.dueText,
                isOverdue ? { color: COLORS.danger, ...FONTS.semiBold } : { color: COLORS.textMuted },
              ]}
            >
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.sm,
  },
  cardOverdue: {
    borderColor: COLORS.dangerBorder,
    backgroundColor: 'rgba(244,63,94,0.03)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: 14,
    color: COLORS.textPrimary,
    ...FONTS.semiBold,
    lineHeight: 20,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 4,
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
  },
  leftTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
    ...FONTS.semiBold,
  },
  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 11,
  },
});
