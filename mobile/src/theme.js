// Colors
export const COLORS = {
  // Backgrounds
  bg: '#0f172a',
  bgCard: '#1e293b',
  bgInput: '#0f172a',
  bgInputBorder: '#334155',
  bgInputBorderFocus: '#6366f1',

  // Brand
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',

  // Borders
  border: '#1e293b',
  borderLight: '#334155',

  // Status
  success: '#10b981',
  successBg: 'rgba(16,185,129,0.1)',
  successBorder: 'rgba(16,185,129,0.3)',

  warning: '#f59e0b',
  warningBg: 'rgba(245,158,11,0.1)',
  warningBorder: 'rgba(245,158,11,0.3)',

  danger: '#f43f5e',
  dangerBg: 'rgba(244,63,94,0.1)',
  dangerBorder: 'rgba(244,63,94,0.3)',

  info: '#38bdf8',
  infoBg: 'rgba(56,189,248,0.1)',
  infoBorder: 'rgba(56,189,248,0.3)',

  slate: '#334155',
  slateBg: 'rgba(51,65,85,0.2)',
  slateBorder: 'rgba(51,65,85,0.5)',
};

// Status badge configs
export const PROJECT_STATUS_CONFIG = {
  NOT_STARTED: {
    label: 'Not Started',
    color: COLORS.textSecondary,
    bg: COLORS.slateBg,
    border: COLORS.slateBorder,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: COLORS.warning,
    bg: COLORS.warningBg,
    border: COLORS.warningBorder,
  },
  COMPLETED: {
    label: 'Completed',
    color: COLORS.success,
    bg: COLORS.successBg,
    border: COLORS.successBorder,
  },
};

export const TASK_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: COLORS.textSecondary,
    bg: COLORS.slateBg,
    border: COLORS.slateBorder,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: COLORS.warning,
    bg: COLORS.warningBg,
    border: COLORS.warningBorder,
  },
  COMPLETED: {
    label: 'Completed',
    color: COLORS.success,
    bg: COLORS.successBg,
    border: COLORS.successBorder,
  },
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: COLORS.success,
    bg: COLORS.successBg,
    border: COLORS.successBorder,
  },
  MEDIUM: {
    label: 'Medium',
    color: COLORS.warning,
    bg: COLORS.warningBg,
    border: COLORS.warningBorder,
  },
  HIGH: {
    label: 'High',
    color: COLORS.danger,
    bg: COLORS.dangerBg,
    border: COLORS.dangerBorder,
  },
};

// Typography
export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

// Spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
