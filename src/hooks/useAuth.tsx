import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Crucial: Ensure 'export' is written right here!
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be nested within an AuthProvider root element.');
  }
  return context;
};
