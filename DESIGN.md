---
name: Industrial Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fb'
  surface-container: '#ecedf6'
  surface-container-high: '#e7e8f0'
  surface-container-highest: '#e1e2ea'
  on-surface: '#191c21'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3037'
  inverse-on-surface: '#eff0f8'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#545f72'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f7'
  on-secondary-container: '#586377'
  tertiary: '#634000'
  on-tertiary: '#ffffff'
  tertiary-container: '#825600'
  on-tertiary-container: '#ffd295'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#d8e3fa'
  secondary-fixed-dim: '#bcc7dd'
  on-secondary-fixed: '#111c2c'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#ffb94c'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#f9f9ff'
  on-background: '#191c21'
  surface-variant: '#e1e2ea'
typography:
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Barlow Condensed
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-sm: 1rem
  margin-md: 2rem
  margin-lg: 4rem
  gutter: 1.5rem
  unit: 0.25rem
---

# Industrial Precision Design System

## Visual Identity
Industrial Precision is designed for technical users who require clarity, speed, and reliability. The aesthetic is "High-Functionality Corporate"—combining the stability of professional enterprise software with the urgent visual cues of an industrial shop floor.

## Color Palette
Our color system is built for high contrast and technical differentiation:
- **Precision Blue (Primary):** Our primary action color (#005EB8). Used for buttons, active navigation, and primary branding to signal movement and system activity.
- **Slate Technical (Secondary):** Used for supporting elements. This slate-gray shade (#4A5568) provides a disciplined, professional balance for secondary buttons and iconography.
- **Industrial Amber (Tertiary):** A high-visibility accent color (#E8A020). This amber is used for critical status indicators, warnings, and machine-state notifications. It ensures that attention-heavy information is immediately visible.
- **Surfaces:** A range of cool grays provide the "workbench" upon which data is displayed, using tonal depth rather than shadows to separate information modules.

## Typography
We utilize a dual-font strategy:
- **Barlow Condensed:** For headlines and labels. Its condensed nature allows for longer technical strings in tight spaces and provides a modern, "machined" look.
- **IBM Plex Sans:** For all body text and data values. This ensures maximum legibility for numbers and technical specifications where character distinction is paramount.

## Layout & Components
The system follows a strict 4px grid. 
- **Components:** Buttons and inputs have a subtle 4px (Soft) roundedness. 
- **Elevation:** We use "Tonal Layering." Higher hierarchy elements are placed on lighter surface containers rather than being lifted by heavy shadows.
- **High-Visibility Accents:** The Tertiary Amber should be used sparingly but consistently for alerts and status-tracking components to maintain its effectiveness as a "warning" hue.