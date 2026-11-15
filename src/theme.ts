import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

/** LumenPath clinical palette: white surfaces, deep teal as the one action color, ink text with a teal cast. */
export const lumenTheme = defineTheme({
  name: 'lumenpath',
  extends: neutralTheme,
  typography: {
    body: {family: 'Figtree', fallbacks: 'system-ui, -apple-system, "Segoe UI", sans-serif'},
    heading: {family: 'Figtree', fallbacks: 'system-ui, -apple-system, "Segoe UI", sans-serif'},
  },
  tokens: {
    '--color-accent': ['#0F5A6A', '#8FD6D2'],
    '--color-on-accent': ['#FFFFFF', '#0B2A31'],
    '--color-accent-muted': ['#E6F1F1', '#164650'],
    '--color-text-accent': ['#0F5A6A', '#8FD6D2'],
    '--color-icon-accent': ['#0F5A6A', '#8FD6D2'],
    '--color-background-body': ['#F7F1E6', '#0B2A31'],
    '--color-background-surface': ['#EFE8DA', '#12404A'],
    '--color-background-card': ['#FFFCF6', '#0F3640'],
    '--color-background-muted': ['#EFE8DA', '#12404A'],
    '--color-border': ['#E2D9C6', '#24565F'],
    '--color-text-primary': ['#0B2A31', '#F4F8F7'],
    '--color-text-secondary': ['#3F5A60', '#B4C7C8'],
  },
  components: {
    button: {base: {borderRadius: '10px', fontWeight: '600'}},
  },
});
