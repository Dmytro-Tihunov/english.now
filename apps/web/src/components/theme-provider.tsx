import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
	undefined,
);

const STORAGE_KEY = "theme";

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(resolved: "light" | "dark") {
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = React.useState<Theme>(() => {
		if (typeof window === "undefined") return "light";
		return (localStorage.getItem(STORAGE_KEY) as Theme) || "light";
	});

	const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

	const setTheme = React.useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem(STORAGE_KEY, newTheme);
	}, []);

	// Apply theme class to <html> whenever resolved theme changes
	React.useEffect(() => {
		applyTheme(resolvedTheme);
	}, [resolvedTheme]);

	// Listen for system preference changes when theme is "system"
	React.useEffect(() => {
		if (theme !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => applyTheme(getSystemTheme());
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [theme]);

	const value = React.useMemo(
		() => ({ theme, setTheme, resolvedTheme }),
		[theme, setTheme, resolvedTheme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
