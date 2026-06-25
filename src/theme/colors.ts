// Color palette — ported from web CSS variables (OKLCH → hex approximations)
// Light mode only for MVP; matches the web look exactly.

export const Colors = {
  background: '#F8FAF0',
  foreground: '#1B3328',
  card: '#FFFFFF',
  cardForeground: '#1B3328',
  primary: '#2E9E5A',
  primaryForeground: '#F8FAF0',
  primaryGlow: '#5CBB7A',
  secondary: '#EDF5E8',
  secondaryForeground: '#1E4A34',
  muted: '#F0F7EB',
  mutedForeground: '#6B8F78',
  accent: '#DAEDC8',
  accentForeground: '#1B4A28',
  border: '#D8E3D4',
  input: '#E8EFE4',
  destructive: '#D94A4A',
  chart1: '#2E9E5A',
  chart2: '#5CBB7A',
  chart3: '#C7D94B',
  chart4: '#D49A4A',
  chart5: '#4A8FC7',

  // Glass card
  glassBackground: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  glassShadow: 'rgba(46, 158, 90, 0.1)',

  // Gradients
  gradientHeroStart: '#EEF8E0',
  gradientHeroMid: '#E0F2D0',
  gradientHeroEnd: '#D0ECC0',
  gradientPrimaryStart: '#2E9E5A',
  gradientPrimaryEnd: '#5CBB7A',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  heroSm: 36,
  heroLg: 42,
};
