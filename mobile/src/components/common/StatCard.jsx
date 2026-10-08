import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

export const StatCard = ({ title, value, icon, color = COLORS.primary, subtitle }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: `${color}1A`, borderColor: `${color}33` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flex: 1,
    minWidth: '45%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    ...FONTS.regular,
  },
  content: {
    marginTop: 2,
  },
  value: {
    fontSize: 22,
    color: COLORS.textPrimary,
    ...FONTS.extraBold,
  },
  title: {
    fontSize: 12,
    color: COLORS.textSecondary,
    ...FONTS.medium,
    marginTop: 2,
  },
});
