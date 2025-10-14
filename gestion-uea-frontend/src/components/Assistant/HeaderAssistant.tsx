import React from "react";

interface AssistantHeaderProps {
  // optional current theme: 'light' | 'dark'
  theme?: "light" | "dark";
  // function to update theme state (setTheme)
  setTheme?: (t: "light" | "dark") => void;
  // backward-compatible prop name
  onToggleTheme?: () => void;
}

const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  theme = "light",
  setTheme,
  onToggleTheme,
}) => {
  const handleToggle = () => {
    if (onToggleTheme) return onToggleTheme();
    if (!setTheme) return;
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#1f2937",
        color: theme === "light" ? "#000" : "#fff",
        padding: "1rem 2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 700 }}>Espace Assistant</h2>
      <button
        onClick={handleToggle}
        style={{
          backgroundColor: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Basculer thème
      </button>
    </header>
  );
};

export default AssistantHeader;
