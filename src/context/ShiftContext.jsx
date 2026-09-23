import React, { createContext, useState, useEffect } from 'react';
import { mockShifts, mockApplications, mockEarnings, mockWeeklyChartData } from '../utils/mockData';

export const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
  const [shifts, setShifts] = useState(mockShifts);
  const [applications, setApplications] = useState(mockApplications);
  const [earnings, setEarnings] = useState(mockEarnings);
  const [weeklyChart, setWeeklyChart] = useState(mockWeeklyChartData);

  const addShift = (newShift) => {
    setShifts([{ ...newShift, id: `s${Date.now()}` }, ...shifts]);
  };

  const applyForShift = async (shiftId, userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if already applied
    if (applications.some(app => app.shiftId === shiftId && app.userId === userId)) {
      return { success: false, message: 'Already applied for this shift.' };
    }

    const newApp = {
      id: `a${Date.now()}`,
      shiftId,
      userId,
      status: 'Pending',
      appliedAt: Date.now(),
    };

    setApplications([newApp, ...applications]);
    return { success: true };
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
  };

  const markShiftFilled = (shiftId) => {
    setShifts(prev => prev.map(shift => 
      shift.id === shiftId ? { ...shift, status: 'Filled' } : shift
    ));
  };

  return (
    <ShiftContext.Provider value={{ shifts, applications, earnings, weeklyChart, addShift, applyForShift, updateApplicationStatus, markShiftFilled }}>
      {children}
    </ShiftContext.Provider>
  );
};
