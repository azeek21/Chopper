let THEME = {
    "light": {
        backgroundColor: {
            primary: "#ffffff",
            secondary: "rgba(129, 0, 148, 0.7)",
            tertiary: "rgba(45,45,45, 0.3)",
            purple: "#810094",
            pink: "#fb457f",
        },
        textColor: {
            primary: "rgb(45, 45, 45)",
            secondary: "rgba(45,45,45, 0.6)",
            tertiary: "rgb(130, 255, 180)",
            purple: "#810094",
            pink: "#fb457f",
        },
        shadow: {
            primary: "0 0 1rem rgba(0, 0, 0, 0.5)",
            secondary: "0 0 1rem rgba(255, 255, 255, 0.3)",
            tertiary: "0 0 1rem rgb(130, 255, 180)",
            purple: "0 0 1rem #810094",
            pink: "0 0 1rem #fb457f",
        }
    },
    "dark" : {
    }
}

export default THEME;

type THEME_TYPE = typeof THEME['light'];

export type {THEME_TYPE};