import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await api.getProfile();
      setUser(data);
    } catch (err) {
      console.error('Failed to load profile:', err.response?.data?.message || err.message);
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const loginUser = async (email, password) => {
    setError(null);
    try {
      const { data } = await api.login({ email, password });
      localStorage.setItem('token', data.token);
      await fetchUserProfile();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      return false;
    }
  };

  const registerUser = async (name, email, password) => {
    setError(null);
    try {
      const { data } = await api.register({ name, email, password });
      localStorage.setItem('token', data.token);
      await fetchUserProfile();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const addSavedProfile = async (profileData) => {
    try {
      const { data } = await api.saveProfile(profileData);
      setUser(prev => ({ ...prev, savedProfiles: data.profiles }));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save birth profile');
      return false;
    }
  };

  const removeSavedProfile = async (id) => {
    try {
      const { data } = await api.deleteProfile(id);
      setUser(prev => ({ ...prev, savedProfiles: data.profiles }));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete birth profile');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        addSavedProfile,
        removeSavedProfile,
        refreshProfile: fetchUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
