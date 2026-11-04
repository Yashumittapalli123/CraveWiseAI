import React, { createContext, useContext, useState } from 'react';
import { CravingTwinResponse } from '../types';

interface CravingContextType {
  activeTwin: CravingTwinResponse | null;
  setActiveTwin: (twin: CravingTwinResponse | null) => void;
}

const CravingContext = createContext<CravingContextType | undefined>(undefined);

export const CravingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTwin, setActiveTwin] = useState<CravingTwinResponse | null>(null);

  return (
    <CravingContext.Provider value={{ activeTwin, setActiveTwin }}>
      {children}
    </CravingContext.Provider>
  );
};

export const useCraving = () => {
  const context = useContext(CravingContext);
  if (!context) throw new Error('useCraving must be used within a CravingProvider');
  return context;
};
