function createFont(defaultVariable = '') {
  return (options?: { variable?: string; [key: string]: any }) => ({
    className: '',
    variable: options?.variable || defaultVariable,
    style: {},
  })
}

export const JetBrains_Mono = createFont('--font-mono')
export const Sora = createFont('--font-sora')
export const Archivo = createFont('--font-archivo')
export const Bodoni_Moda = createFont('--font-bodoni')
export const Geist = createFont('--font-geist')
export const Geist_Mono = createFont('--font-geist-mono')
export const Instrument_Sans = createFont('--font-instrument')
export const Instrument_Serif = createFont('--font-instrument-serif')
export const Space_Grotesk = createFont('--font-space')
export const Syne = createFont('--font-syne')
export const Orbitron = createFont('--font-orbitron')
export const Inter = createFont('--font-inter')
