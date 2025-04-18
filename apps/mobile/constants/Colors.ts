/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const courseHeaderGradients = [
  ["#FF603E", "white"],
  ["#89FF91", "white"],
  ["#FFD789", "white"],
  ["#C089FF", "white"],
];

export const courseColors = {
  A1: {
    background: "#FF603E",
    gradient: ["#FF603E", "white"],
  },
  A2: {
    background: "#FFDC61",
    gradient: ["#FFDC61", "white"],
  },
  B1: {
    background: "#10CD7E",
    gradient: ["#10CD7E", "white"],
  },
  B2: {
    background: "#1FA2FF",
    gradient: ["#1FA2FF", "white"],
  },
  C1: {
    background: "#FFD789",
    gradient: ["#FFD789", "white"],
  },
  C2: {
    background: "#FF603E",
    gradient: ["#FF603E", "white"],
  },
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    background_secondary: "#F2F2F0",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    background_secondary: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
  courseHeaderGradients,
};
