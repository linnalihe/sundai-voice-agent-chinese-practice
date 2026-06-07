import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#fafaf9',
        card: '#ffffff',
        ink: {
          DEFAULT: '#18181b',
          muted: '#52525b',
          faint: '#a1a1aa',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      borderColor: {
        subtle: 'rgba(24,24,27,0.10)',
        DEFAULT: 'rgba(24,24,27,0.18)',
      },
    },
  },
  plugins: [],
}

export default config
