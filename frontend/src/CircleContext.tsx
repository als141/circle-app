import React, { createContext, useState, useContext, useEffect } from 'react';

interface Circle {
  id: string;
  name: string;
}

interface CircleContextType {
  activeCircle: Circle | null;
  setActiveCircle: (circle: Circle | null) => void;
}

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export const CircleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCircle, setActiveCircle] = useState<Circle | null>(() => {
    const storedCircle = localStorage.getItem('activeCircle');
    return storedCircle ? JSON.parse(storedCircle) : null;
  });

  useEffect(() => {
    if (activeCircle) {
      localStorage.setItem('activeCircle', JSON.stringify(activeCircle));
    } else {
      localStorage.removeItem('activeCircle');
    }
  }, [activeCircle]);

  return (
    <CircleContext.Provider value={{ activeCircle, setActiveCircle }}>
      {children}
    </CircleContext.Provider>
  );
};

export const useCircle = () => {
  const context = useContext(CircleContext);
  if (context === undefined) {
    throw new Error('useCircle must be used within a CircleProvider');
  }
  return context;
};