import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "false" ? false : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
};
