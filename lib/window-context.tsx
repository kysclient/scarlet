import { createContext, useContext, useState, useEffect } from "react";

export const WindowContext = createContext(null);

export function WindowContextProvider({ children }: any) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const value: any = {
    ...windowSize,
    isMobile: windowSize.width < 500,
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow() {
  const context = useContext(WindowContext);

  if (!context)
    throw new Error("useWindow must be used within an WindowContextProvider");

  return context;
}