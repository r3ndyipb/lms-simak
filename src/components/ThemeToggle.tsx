"use client";

import React, { useEffect, useState } from "react";
import FlatIcon from "./FlatIcon";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentDocTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
    const savedTheme = localStorage.getItem("simak_theme") as "light" | "dark" | null;
    const active = currentDocTheme === "dark" || savedTheme === "dark" ? "dark" : "light";
    setTheme(active);
    document.documentElement.setAttribute("data-theme", active);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("simak_theme", next);
    localStorage.setItem("anvieo_theme", next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="portal-theme-btn"
        aria-label="Ganti Tema Warna"
        style={{ opacity: 0.7 }}
      >
        <FlatIcon type="moon" size={17} />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="portal-theme-btn"
      onClick={toggleTheme}
      aria-label="Ganti Tema Warna"
      title={theme === "light" ? "Beralih ke Tema Gelap" : "Beralih ke Tema Terang"}
    >
      {theme === "light" ? (
        <FlatIcon type="moon" size={17} />
      ) : (
        <FlatIcon type="sun" size={17} />
      )}
    </button>
  );
}
