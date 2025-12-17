import { createContext } from 'react'
import { createTheme, type PaletteMode } from '@mui/material/styles'

type Scheme = {
  primary: string
  on_primary: string
  primary_container: string
  on_primary_container: string
  secondary: string
  on_secondary: string
  secondary_container: string
  on_secondary_container: string
  tertiary: string
  on_tertiary: string
  tertiary_container: string
  on_tertiary_container: string
  error: string
  on_error: string
  error_container: string
  on_error_container: string
  background: string
  surface: string
  on_surface: string
  surface_variant: string
  on_surface_variant: string
  outline: string
  outline_variant: string
  inverse_surface: string
  inverse_on_surface: string
  inverse_primary: string
  surface_container_high: string
  surface_container: string
  surface_container_low: string
}

// Palette synced with material-theme.json (Material Theme Builder export 2025-12-16)
const materialSchemes: Record<PaletteMode, Scheme> = {
  light: {
    primary: '#0057ce',
    on_primary: '#FFFFFF',
    primary_container: '#DAE2FF',
    on_primary_container: '#001946',
    secondary: '#585e71',
    on_secondary: '#FFFFFF',
    secondary_container: '#dce2f9',
    on_secondary_container: '#151b2c',
    tertiary: '#735572',
    on_tertiary: '#FFFFFF',
    tertiary_container: '#fed7fa',
    on_tertiary_container: '#2a122c',
    error: '#BA1A1A',
    on_error: '#FFFFFF',
    error_container: '#ffdad6',
    on_error_container: '#410002',
    background: '#fefbff',
    surface: '#fefbff',
    on_surface: '#1b1b1f',
    surface_variant: '#e1e2ec',
    on_surface_variant: '#44464f',
    outline: '#757780',
    outline_variant: '#c5c6d0',
    inverse_surface: '#303034',
    inverse_on_surface: '#f2f0f4',
    inverse_primary: '#b1c5ff',
    surface_container_high: '#e0e8f9',
    surface_container: '#e2e9fa',
    surface_container_low: '#f2f3fd',
  },
  dark: {
    primary: '#b1c5ff',
    on_primary: '#002c71',
    primary_container: '#00419e',
    on_primary_container: '#dae2ff',
    secondary: '#c0c6dc',
    on_secondary: '#2a3042',
    secondary_container: '#404659',
    on_secondary_container: '#dce2f9',
    tertiary: '#e0bbdd',
    on_tertiary: '#412742',
    tertiary_container: '#593d59',
    on_tertiary_container: '#fed7fa',
    error: '#ffb4ab',
    on_error: '#690005',
    error_container: '#93000a',
    on_error_container: '#ffb4ab',
    background: '#1b1b1f',
    surface: '#1b1b1f',
    on_surface: '#e4e2e6',
    surface_variant: '#44464f',
    on_surface_variant: '#c5c6d0',
    outline: '#8f9099',
    outline_variant: '#44464f',
    inverse_surface: '#e4e2e6',
    inverse_on_surface: '#303034',
    inverse_primary: '#0057ce',
    surface_container_high: '#2d2f39',
    surface_container: '#2b2e38',
    surface_container_low: '#22232a',
  },
}

export const ColorModeContext = createContext<{
  mode: PaletteMode
  toggleMode: () => void
}>({
  mode: 'light',
  toggleMode: () => {},
})

export const createAppTheme = (mode: PaletteMode) => {
  const palette = materialSchemes[mode]

  return createTheme({
    palette: {
      mode,
      primary: {
        main: palette.primary,
        contrastText: palette.on_primary,
      },
      secondary: {
        main: palette.secondary,
        contrastText: palette.on_secondary,
      },
      error: {
        main: palette.error,
        light: palette.error_container,
        contrastText: palette.on_error,
      },
      background: {
        default: palette.background,
        paper: palette.surface_container_low,
      },
      text: {
        primary: palette.on_surface,
        secondary: palette.on_surface_variant,
      },
      divider: palette.outline_variant,
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter","Segoe UI","Noto Sans","Helvetica Neue",Arial,sans-serif',
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background,
            backgroundImage: `linear-gradient(180deg, ${palette.surface} 0%, ${palette.surface_container} 100%)`,
            color: palette.on_surface,
            colorScheme: mode,
          },
        },
      },
    },
  })
}
