/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /^bg-/,
    },
    {
      pattern: /^text-/,
    },
    "dark",
    "light",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-kalam)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        "card-bg": "var(--card-bg)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: theme("colors.gray.700"),
            lineHeight: "1.8",
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
            },
            a: {
              color: theme("colors.purple.600"),
              "&:hover": {
                color: theme("colors.purple.700"),
              },
              textDecoration: "underline",
            },
            h1: {
              color: theme("colors.gray.900"),
              fontWeight: "700",
              fontSize: "2.25em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.3",
            },
            h2: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              fontSize: "1.75em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.3",
            },
            h3: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              fontSize: "1.5em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.3",
            },
            h4: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              marginTop: "1.5em",
              marginBottom: "0.8em",
            },
            strong: {
              color: theme("colors.gray.900"),
              fontWeight: "700",
            },
            code: {
              color: theme("colors.purple.600"),
              backgroundColor: theme("colors.gray.100"),
              padding: "0.25rem",
              borderRadius: "0.25rem",
              fontWeight: "600",
            },
            pre: {
              backgroundColor: theme("colors.gray.800"),
              color: theme("colors.gray.200"),
              padding: "1.5rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
              marginTop: "1.5em",
              marginBottom: "1.5em",
            },
            blockquote: {
              color: theme("colors.gray.800"),
              borderLeftColor: theme("colors.gray.300"),
              borderLeftWidth: "4px",
              paddingLeft: "1.5rem",
              fontStyle: "italic",
              marginTop: "1.5em",
              marginBottom: "1.5em",
            },
            ul: {
              marginTop: "0.75em",
              marginBottom: "0.75em",
              paddingLeft: "1.25em",
              listStyleType: "disc",
            },
            ol: {
              marginTop: "0.75em",
              marginBottom: "0.75em",
              paddingLeft: "1.25em",
              listStyleType: "decimal",
            },
            li: {
              marginTop: "0.25em",
              marginBottom: "0.25em",
              paddingLeft: "0.25em",
            },
            "li > p": {
              marginTop: "0.25em",
              marginBottom: "0.25em",
            },
            "li > ul": {
              marginTop: "0.25em",
              marginBottom: "0.25em",
            },
            "li > ol": {
              marginTop: "0.25em",
              marginBottom: "0.25em",
            },
            hr: {
              borderColor: theme("colors.gray.300"),
              marginTop: "2em",
              marginBottom: "2em",
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.300"),
            a: {
              color: theme("colors.purple.400"),
              "&:hover": {
                color: theme("colors.purple.300"),
              },
            },
            h1: {
              color: theme("colors.white"),
            },
            h2: {
              color: theme("colors.white"),
            },
            h3: {
              color: theme("colors.white"),
            },
            h4: {
              color: theme("colors.white"),
            },
            strong: {
              color: theme("colors.white"),
            },
            code: {
              color: theme("colors.purple.400"),
              backgroundColor: theme("colors.gray.800"),
            },
            pre: {
              backgroundColor: theme("colors.gray.900"),
              color: theme("colors.gray.200"),
            },
            blockquote: {
              color: theme("colors.gray.300"),
              borderLeftColor: theme("colors.gray.700"),
            },
            hr: {
              borderColor: theme("colors.gray.700"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
