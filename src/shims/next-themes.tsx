import React, { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  theme: string
  resolvedTheme: string
  setTheme: (theme: string) => void
  themes: string[]
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
  themes: ['light', 'dark'],
})

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  attribute = 'class',
}: {
  children: React.ReactNode
  defaultTheme?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  const [theme, setThemeState] = useState(defaultTheme)

  useEffect(() => {
    const root = document.documentElement
    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    } else {
      root.setAttribute(attribute, theme)
    }
  }, [theme, attribute])

  const setTheme = (next: string) => {
    setThemeState(next)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: theme,
        setTheme,
        themes: ['light', 'dark'],
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  const [, setRerender] = useState({})

  const setTheme = (next: string) => {
    ctx.setTheme(next)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(next)
      document.documentElement.setAttribute('data-theme', next)
    }
    setRerender({})
  }

  const current =
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light'
      : ctx.theme

  return {
    theme: current,
    resolvedTheme: current,
    setTheme,
    themes: ctx.themes,
  }
}
