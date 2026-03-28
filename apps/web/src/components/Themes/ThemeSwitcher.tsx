"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const {theme, toggleTheme} = useTheme(); // <- TODO: Get the theme from the context

  return (
    <Button className="text-primary" onClick={toggleTheme}>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</Button>
  );
};

export default ThemeSwitch;
