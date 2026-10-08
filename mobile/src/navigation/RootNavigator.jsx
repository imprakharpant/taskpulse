import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { LoadingScreen } from '../components/common/LoadingScreen';

export const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};
