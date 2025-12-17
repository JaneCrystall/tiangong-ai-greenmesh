import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { ColorModeContext, createAppTheme } from './app/theme'

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
  )
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const theme = useMemo(() => createAppTheme(mode), [mode])
  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme')
    document.body.classList.add(mode === 'dark' ? 'dark-theme' : 'light-theme')
  }, [mode])

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  )
}

export default App
