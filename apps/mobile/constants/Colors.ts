/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const courseID: Record<number, string> = {
  2: "A1",
  3: "A2",
  4: "B1",
  5: "B2",
  6: "C1",
  7: "C2",
};

export const courseColors: Record<
  string,
  { background: string; gradient: string[] }
> = {
  A1: {
    background: "#FF603E",
    gradient: ["#FF603E", "#EDE9E6"],
  },
  A2: {
    background: "#FFDC61",
    gradient: ["#FFDC61", "#EDE9E6"],
  },
  B1: {
    background: "#FF8B4A",
    gradient: ["#FF8B4A", "#EDE9E6"],
  },
  B2: {
    background: "#A056FF",
    gradient: ["#A056FF", "#EDE9E6"],
  },
  C1: {
    background: "#FFD789",
    gradient: ["#FFD789", "#EDE9E6"],
  },
  C2: {
    background: "#FF603E",
    gradient: ["#FF603E", "#EDE9E6"],
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
};
