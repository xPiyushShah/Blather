// import daisyui from "daisyui";

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [daisyui],
//   daisyui: {
//     themes: [
//       "light",
//       "dark",
//       // "cupcake",
//       // "bumblebee",
//       // "emerald",
//       // "corporate",
//       // "synthwave",
//       // "retro",
//       // "cyberpunk",
//       // "valentine",
//       // "halloween",
//       // "garden",
//       // "forest",
//       // "aqua",
//       // "lofi",
//       // "pastel",
//       // "fantasy",
//       // "wireframe",
//       // "black",
//       // "luxury",
//       // "dracula",
//       // "cmyk",
//       // "autumn",
//       // "business",
//       // "acid",
//       // "lemonade",
//       // "night",
//       // "coffee",
//       // "winter",
//       // "dim",
//       // "nord",
//       // "sunset",
//     ],
//   },
// };
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "base-100": "#f5f7fa", // 👈 Change this to your desired background color
          // You can also customize other variables like:
          // "primary": "#34d399",
          // "secondary": "#facc15",
        },
      },
      "dark", // Keep dark theme as default
    ],
  },
};
