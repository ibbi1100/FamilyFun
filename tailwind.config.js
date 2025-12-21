/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#57f906",
                "primary-dark": "#43c404",
                "background-light": "#f6f8f5",
                "background-dark": "#16230f",
                "surface-light": "#ffffff",
                "surface-dark": "#1f2e1a",
                "text-main-light": "#131811",
                "text-main-dark": "#e2e8e0",
                "text-sec-light": "#6e8c5f",
                "text-sec-dark": "#a1bd94",
            },
            fontFamily: {
                "display": ["Spline Sans", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "1.5rem",
                "xl": "2rem",
                "2xl": "2.5rem",
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
