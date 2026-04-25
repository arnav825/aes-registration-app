import { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel]       = useState(null);
  const [completedReg, setCompletedReg]         = useState(null);

  const reset = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setCompletedReg(null);
  };

  return (
    <RegistrationContext.Provider value={{
      selectedCategory, setSelectedCategory,
      selectedLevel,    setSelectedLevel,
      completedReg,     setCompletedReg,
      reset,
    }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used within RegistrationProvider');
  return ctx;
}
