import type { Config } from "tailwindcss";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Slate 900
                surface: "#1e293b",    // Slate 800
                primary: "#3b82f6",    // Blue 500
                secondary: "#06b6d4",  // Cyan 500
                accent: "#8b5cf6",     // Violet 500
                success: "#10b981",    // Emerald 500
                warning: "#f59e0b",    // Amber 500
                error: "#ef4444",      // Red 500
                "glass-border": "rgba(255, 255, 255, 0.1)",
                "glass-surface": "rgba(30, 41, 59, 0.7)",
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Outfit"', 'sans-serif'],
            },
            animation: {
                "spin-slow": "spin 3s linear infinite",
                "float": "float 6s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                }
            },
            backdropBlur: {
                xs: "2px",
            }
        },
    },
    plugins: [],
} satisfies Config;
