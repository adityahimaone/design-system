export type Metadata = {
  title?: string | { default: string; template?: string }
  description?: string
  alternates?: { canonical?: string }
  robots?: any
  openGraph?: any
  twitter?: any
  [key: string]: any
}

export type Viewport = {
  width?: string
  initialScale?: number
  themeColor?: string | Array<{ media?: string; color: string }>
  [key: string]: any
}
