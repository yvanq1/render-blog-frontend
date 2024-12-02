import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import ParticleBackground from '../UI/ParticleBackground';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || '登录失败，请检查邮箱和密码');
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
          <h2 className="text-3xl font-bold text-white mb-2 font-['Orbitron']">登录</h2>
          <p className="text-gray-300">开启你的AI研学之旅</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg 
                        font-semibold hover:from-cyan-600 hover:to-blue-600 transition duration-300 
                        shadow-lg hover:shadow-cyan-500/30"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-300">
          还没有账号？{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition duration-300">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
