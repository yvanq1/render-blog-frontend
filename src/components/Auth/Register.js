import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import ParticleBackground from '../UI/ParticleBackground';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      throw new Error('所有字段都是必填的');
    }
    if (formData.password.length < 6) {
      throw new Error('密码长度至少为6个字符');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      throw new Error('请输入有效的邮箱地址');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      validateForm();
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || '注册失败，请重试');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ParticleBackground />
      <div className="glass-card w-full max-w-md p-8 rounded-2xl space-y-6 relative">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 font-['Orbitron']">注册</h2>
          <p className="text-gray-300">创建你的账号</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}
          <div>
            <input
              type="text"
              placeholder="用户名"
              value={formData.username}
              onChange={handleChange}
              name="username"
              className="w-full px-4 py-3 rounded-lg"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="邮箱地址"
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="w-full px-4 py-3 rounded-lg"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="密码"
              value={formData.password}
              onChange={handleChange}
              name="password"
              className="w-full px-4 py-3 rounded-lg"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="确认密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              className="w-full px-4 py-3 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                注册
                <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-gray-300">
          已有账号？{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
            登录
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
