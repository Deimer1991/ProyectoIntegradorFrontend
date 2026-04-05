import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // ✅ Lee la preferencia guardada en sessionStorage al iniciar
  const [darkMode, setDarkMode] = useState(() => {
    return sessionStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const nuevoValor = !prev;
      // ✅ Guarda la preferencia en sessionStorage
      sessionStorage.setItem("darkMode", nuevoValor);
      return nuevoValor;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={darkMode ? "dark-mode" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);