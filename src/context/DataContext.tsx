import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDataForDate, getAvailableDates } from '../data/data';
import type { DataContextType, DayData } from '../data/types';

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentData, setCurrentData] = useState<DayData | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Initialize available dates and select the latest dataset automatically
  useEffect(() => {
    const dates = getAvailableDates();
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[dates.length - 1]);
    }
  }, []);

  // Load data when selected date changes
  useEffect(() => {
    const data = getDataForDate(selectedDate);
    setCurrentData(data);
  }, [selectedDate]);

  const value: DataContextType = {
    selectedDate,
    setSelectedDate,
    currentData,
    availableDates,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
