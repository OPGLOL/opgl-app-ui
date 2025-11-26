import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Theme type definition
type Theme = "light" | "dark" | "system";

// Context interface
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key for localStorage
const STORAGE_KEY = "opgl-theme";

// Get the system preferred color scheme
function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

// Get the stored theme from localStorage
function getStoredTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  }
  return "system";
}

// ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(getSystemTheme);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme class
    root.classList.remove("light", "dark");

    // Determine the actual theme to apply
    const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

    // Add the appropriate class
    root.classList.add(effectiveTheme);
    setResolvedTheme(effectiveTheme);

    // Store the preference
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      const newTheme = event.matches ? "dark" : "light";
      setResolvedTheme(newTheme);

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
