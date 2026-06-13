import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg-primary)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          border: 'var(--border-color)',
          glass: 'var(--glass-bg)',
        },
        void: '#000000',
        ice: '#FFFFFF',
        muted: '#888888',
        ember: '#0066FF',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
