import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNetwork } from '../../context/NetworkContext';
import { COLORS, FONTS, SPACING } from '../../theme';

export const OfflineBanner = () => {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons name="wifi-off" size={16} color="#ffffff" style={styles.icon} />
      <Text style={styles.text}>No internet connection. Some features may be unavailable.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    ...FONTS.medium,
  },
});
