import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, PROJECT_STATUS_CONFIG } from '../../theme';

export const ProjectCard = ({ project, onPress }) => {
  const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.NOT_STARTED;
  const taskCount = project._count?.tasks ?? 0;

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
          <Text style={[styles.badgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>

      {project.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Ionicons name="checkbox-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</Text>
        </View>

        {project.endDate ? (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{new Date(project.endDate).toLocaleDateString()}</Text>
          </View>
        ) : null}

        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={styles.arrow} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    flex: 1,
    marginRight: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    ...FONTS.semiBold,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51,65,85,0.4)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 4,
    ...FONTS.medium,
  },
  arrow: {
    marginLeft: 'auto',
  },
});
