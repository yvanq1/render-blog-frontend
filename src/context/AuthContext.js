import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查会话状态
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/check', {
          withCredentials: true
        });
        if (response.data.success) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error('身份验证检查失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true };
      } else {
        throw new Error(response.data.message || '登录失败');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || '登录失败'
      };
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        username,
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true };
      } else {
        throw new Error(response.data.message || '注册失败');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || '注册失败'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;