/**
 * Yemenite-Inspired Theme Configuration Types
 * 
 * This file provides TypeScript interfaces for the theme configuration,
 * ensuring type safety when accessing theme values in React components.
 */

/**
 * Color palette interface
 */
export interface ColorPalette {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Background colors
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  
  // Text colors
  text: string;
  textLight: string;
  textMuted: string;
  
  // Utility colors
  white: string;
  black: string;
  error: string;
  success: string;
  border: string;
}

/**
 * Typography configuration interface
 */
export interface Typography {
  // Font families
  fontHeading: string;
  fontBody: string;
  fontHebrew: string;
  fontCode: string;
  
  // Font sizes
  fontSizeBase: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  fontSize5xl: string;
  
  // Font weights
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  
  // Line heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  lineHeightLoose: number;
  
  // Letter spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
  letterSpacingWider: string;
}

/**
 * Spacing system interface
 */
export interface Spacing {
  unit: string;
  spacing0: string;
  spacing1: string;
  spacing2: string;
  spacing3: string;
  spacing4: string;
  spacing5: string;
  spacing6: string;
  spacing8: string;
  spacing10: string;
  spacing12: string;
  spacing16: string;
  spacing20: string;
  spacing24: string;
  
  // Section spacing
  sectionPaddingMobile: string;
  sectionPaddingTablet: string;
  sectionPaddingDesktop: string;
  
  // Container widths
  containerMaxWidth: string;
  containerNarrow: string;
  containerWide: string;
}

/**
 * Breakpoints interface
 */
export interface Breakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
  ultra: string;
}

/**
 * Border radius interface
 */
export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Shadows interface
 */
export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Transitions interface
 */
export interface Transitions {
  fast: string;
  base: string;
  slow: string;
}

/**
 * Z-index scale interface
 */
export interface ZIndex {
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
}

/**
 * Complete theme configuration interface
 */
export interface YemeniteTheme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
  borderRadius: BorderRadius;
  shadows: Shadows;
  transitions: Transitions;
  zIndex: ZIndex;
}

/**
 * Theme configuration object
 * This object provides programmatic access to theme values
 */
export const theme: YemeniteTheme = {
  colors: {
    primary: '#b85a3d',
    primaryLight: '#d4704f',
    primaryDark: '#a04a2d',
    secondary: '#2c5f7d',
    secondaryLight: '#3a6a86',
    secondaryDark: '#1e4456',
    accent: '#d4a574',
    accentLight: '#e6c199',
    accentDark: '#b8895a',
    background: '#f5f0e8',
    backgroundLight: '#faf7f2',
    backgroundDark: '#e8dfd0',
    text: '#3d2817',
    textLight: '#6b5444',
    textMuted: '#6f5a4d',
    white: '#ffffff',
    black: '#000000',
    error: '#b03828',
    success: '#3f6a50',
    border: '#d4c4b0',
  },
  typography: {
    fontHeading: "'Georgia', 'Times New Roman', serif",
    fontBody: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontHebrew: "'Arial', 'Helvetica', 'Noto Sans Hebrew', 'David Libre', sans-serif",
    fontCode: "'Courier New', Courier, monospace",
    fontSizeBase: '16px',
    fontSizeXs: '0.75rem',
    fontSizeSm: '0.875rem',
    fontSizeMd: '1rem',
    fontSizeLg: '1.125rem',
    fontSizeXl: '1.25rem',
    fontSize2xl: '1.5rem',
    fontSize3xl: '1.875rem',
    fontSize4xl: '2.25rem',
    fontSize5xl: '3rem',
    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
    lineHeightTight: 1.25,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.75,
    lineHeightLoose: 2,
    letterSpacingTight: '-0.025em',
    letterSpacingNormal: '0',
    letterSpacingWide: '0.025em',
    letterSpacingWider: '0.05em',
  },
  spacing: {
    unit: '8px',
    spacing0: '0',
    spacing1: '4px',
    spacing2: '8px',
    spacing3: '12px',
    spacing4: '16px',
    spacing5: '20px',
    spacing6: '24px',
    spacing8: '32px',
    spacing10: '40px',
    spacing12: '48px',
    spacing16: '64px',
    spacing20: '80px',
    spacing24: '96px',
    sectionPaddingMobile: '48px',
    sectionPaddingTablet: '64px',
    sectionPaddingDesktop: '80px',
    containerMaxWidth: '1200px',
    containerNarrow: '800px',
    containerWide: '1440px',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
    ultra: '2560px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(61, 40, 23, 0.05)',
    md: '0 4px 6px -1px rgba(61, 40, 23, 0.1), 0 2px 4px -1px rgba(61, 40, 23, 0.06)',
    lg: '0 10px 15px -3px rgba(61, 40, 23, 0.1), 0 4px 6px -2px rgba(61, 40, 23, 0.05)',
    xl: '0 20px 25px -5px rgba(61, 40, 23, 0.1), 0 10px 10px -5px rgba(61, 40, 23, 0.04)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

/**
 * Helper function to get CSS custom property value
 * @param propertyName - The CSS custom property name (without --)
 * @returns The computed value of the CSS custom property
 */
export const getCSSVariable = (propertyName: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${propertyName}`)
    .trim();
};

/**
 * Helper function to set CSS custom property value
 * @param propertyName - The CSS custom property name (without --)
 * @param value - The value to set
 */
export const setCSSVariable = (propertyName: string, value: string): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(`--${propertyName}`, value);
};
