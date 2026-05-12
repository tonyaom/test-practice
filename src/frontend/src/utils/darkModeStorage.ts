const KEY = "theme-preference";

/** Returns the stored theme preference ('dark', 'light', or null). */
export function getStoredTheme(): "dark" | "light" | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "dark" || v === "light") return v;
    return null;
  } catch {
    return null;
  }
}

/** Persists the theme preference. */
export function setStoredTheme(theme: "dark" | "light"): void {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
}

/** Applies the theme by toggling the 'dark' class on documentElement. */
export function applyTheme(theme: "dark" | "light"): void {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

/** Returns the currently active theme from documentElement. */
export function getActiveTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Toggles between dark/light, persists, and returns the new theme. */
export function toggleTheme(): "dark" | "light" {
  const current = getActiveTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  setStoredTheme(next);
  return next;
}
