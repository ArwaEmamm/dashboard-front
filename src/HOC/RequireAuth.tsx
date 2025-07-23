
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/index';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn as boolean);
  return loggedIn ? <>{children}</> : <Navigate to="/" />;
};

export default RequireAuth;
