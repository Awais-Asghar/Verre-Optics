import { useEffect, useState, useCallback } from "react";

const KEY = "framefit-theme";

// Reads the theme set by the pre-paint script in index.html, keeps React in
// sync, and persists changes. Defaults follow the OS preference.
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.dataset.theme || "light"
      : "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, setTheme, toggle };
}
