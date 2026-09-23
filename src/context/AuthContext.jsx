import React, { createContext, useState, useEffect } from 'react';
import { mockUsers } from '../utils/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('shiftly_token');
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem('shiftly_user'));
      if (savedUser) setUser(savedUser);
    }
    
    // Load lockout state
    const savedLockout = localStorage.getItem('shiftly_lockout');
    if (savedLockout && new Date().getTime() < parseInt(savedLockout)) {
      setLockoutUntil(parseInt(savedLockout));
    }
    
    setLoading(false);
  }, []);

  // Clear lockout when it expires
  useEffect(() => {
    if (lockoutUntil) {
      const remainingTime = lockoutUntil - new Date().getTime();
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setLockoutUntil(null);
          setFailedAttempts(0);
          localStorage.removeItem('shiftly_lockout');
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        setLockoutUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem('shiftly_lockout');
      }
    }
  }, [lockoutUntil]);

  const handleRateLimit = () => {
    const attempts = failedAttempts + 1;
    setFailedAttempts(attempts);
    
    if (attempts >= 3) {
      const lockoutTime = new Date().getTime() + 30000;
      setLockoutUntil(lockoutTime);
      localStorage.setItem('shiftly_lockout', lockoutTime.toString());
      return { success: false, message: 'Too many failed attempts. Try again in 30 seconds.' };
    }
    
    return { success: false, message: 'Invalid email or password.' };
  };

  const login = async (email, password) => {
    if (lockoutUntil) return { success: false, message: 'Too many failed attempts. Try again later.' };
    await new Promise(resolve => setTimeout(resolve, 600));

    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setFailedAttempts(0);
      localStorage.setItem('shiftly_token', `mock_jwt_${Date.now()}`);
      localStorage.setItem('shiftly_user', JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true, user: foundUser };
    }

    return handleRateLimit();
  };

  const signup = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (mockUsers.some(u => u.email === userData.email)) return { success: false, message: 'Email already registered.' };

    const newUser = { id: `u${Date.now()}`, verified: false, bio: '', ...userData };
    localStorage.setItem('shiftly_token', `mock_jwt_${Date.now()}`);
    localStorage.setItem('shiftly_user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const updateProfile = async (updates) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('shiftly_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('shiftly_token');
    localStorage.removeItem('shiftly_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading, lockoutUntil }}>
      {children}
    </AuthContext.Provider>
  );
};
