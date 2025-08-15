import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
    theme: localStorage.getItem("chat-theme") || "dark",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
}));
// import { create } from "zustand";

// const keys = ["chat-theme", "chatheader", "sidebar", "header", "list_bg"];

// export const useThemeStore = create((set) => {
//     const savedStyles = {};
//     keys.forEach((key) => {
//         const cssVar = key.replace("_", "-");
//         const val = localStorage.getItem(key);
//         if (val) {
//             document.documentElement.style.setProperty(`--${cssVar}`, val);
//             savedStyles[cssVar] = val;
//         }
//     });

//     return {
//         styles: savedStyles,

//         setStyle: (key, value) => {
//             const cssVar = key.replace("_", "-");
//             localStorage.setItem(key, value);
//             document.documentElement.style.setProperty(`--${cssVar}`, value);

//             set((state) => ({
//                 styles: {
//                     ...state.styles,
//                     [cssVar]: value,
//                 },
//             }));
//         },

//         setThemeClass: (theme) => {
//             const body = document.body;
//             if (theme === "dark") {
//                 body.classList.add("dark");
//             } else {
//                 body.classList.remove("dark");
//             }
//             localStorage.setItem("chat-theme", theme);
//         },
//     };
// });
