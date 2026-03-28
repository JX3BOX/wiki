/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./public/**/*.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./demo/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/@jx3box/jx3box-ui/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};
