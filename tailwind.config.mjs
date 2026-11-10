/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        botanical: {
          lime: '#D4ED9D',
          sage: '#64A97B',
          slate: '#3A5465',
          charcoal: '#3D3931',
          alabaster: '#F7FBF2',
          white: '#FFFFFF',
          darkBg: '#23211C',
          darkWorkspace: '#2C3E4A',
        },
        surface: {
          primary: 'var(--bg-primary)',
          card: 'var(--bg-surface-card)',
          workspace: 'var(--workspace-box-bg)',
          secondary: 'var(--secondary-accent-surface)',
          pill: 'var(--highlight-pill-badge)',
        },
        action: {
          primary: 'var(--primary-action-button)',
          hover: 'var(--primary-action-hover)',
          text: 'var(--primary-action-text)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Plus Jakarta Sans',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        workspace: '0 20px 50px -12px rgba(58, 84, 101, 0.14), 0 0 0 2px var(--border-color)',
        'workspace-dark': '0 20px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 2px var(--border-color)',
        btn: '0 8px 24px -4px rgba(58, 84, 101, 0.35)',
        'btn-sage': '0 8px 24px -4px rgba(100, 169, 123, 0.45)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(100, 169, 123, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(100, 169, 123, 0)' },
        },
      },
      animation: {
        'float-slow': 'floatSlow 3.6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.4s infinite',
      },
    },
  },
  plugins: [],
};
