import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('检查认证状态 - 当前token:', token ? '存在' : '不存在');
      
      if (!token) {
        console.log('未找到token，用户未登录');
        setLoading(false);
        return;
      }

      console.log('发送认证检查请求到:', `${API_URL}/api/auth/check`);
      const response = await axios.get(`${API_URL}/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('认证检查响应:', response.data);
      if (response.data.success) {
        console.log('用户认证成功，用户信息:', response.data.data.user);
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('身份验证检查失败:', error);
      console.log('错误详情:', error.response?.data || '无详细错误信息');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('开始登录请求 - API地址:', `${API_URL}/api/auth/login`);
      console.log('登录信息:', { email });

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      console.log('登录响应:', response.data);
      if (response.data.success) {
        const token = response.data.data.token;
        console.log('登录成功 - JWT Token:', token.substring(0, 20) + '...');
        console.log('用户信息:', response.data.data.user);
        
        localStorage.setItem('token', token);
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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;