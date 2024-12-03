import React, { useState, Fragment, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { API_URL } from '../../config/api';

import { 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  BookmarkIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useFavorite } from '../../context/FavoriteContext';
import classNames from 'classnames';
import axios from 'axios';

const navigation = [
  { name: 'Stable Diffusion', href: '/stable-diffusion' },
  { name: 'ComfyUI', href: '/comfyui' },
  { name: 'Midjourney', href: '/midjourney' },
  { name: 'Others', href: '/others' },
  { name: 'About Me', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
];

// 模糊搜索函数
function fuzzyMatch(text, query) {
  if (!text || !query) return 0;
  text = text.toLowerCase();
  query = query.toLowerCase();
  
  // 完全包含直接返回最高分
  if (text.includes(query)) {
    return 1;
  }
  
  let score = 0;
  let textIndex = 0;
  let prevMatchIndex = -1;
  
  // 遍历查询字符
  for (let queryIndex = 0; queryIndex < query.length; queryIndex++) {
    const queryChar = query[queryIndex];
    let found = false;
    
    // 在文本中寻找匹配字符
    while (textIndex < text.length) {
      if (text[textIndex] === queryChar) {
        found = true;
        
        // 连续匹配给予更高分数
        if (prevMatchIndex !== -1 && textIndex === prevMatchIndex + 1) {
          score += 0.5;
        }
        
        score += 0.1;
        prevMatchIndex = textIndex;
        textIndex++;
        break;
      }
      textIndex++;
    }
    
    // 未找到匹配字符
    if (!found) {
      return 0;
    }
  }
  
  // 根据匹配位置的分散程度调整分数
  const matchLength = prevMatchIndex - (textIndex - query.length) + 1;
  score = score / (1 + matchLength * 0.01);
  
  return Math.min(1, score);
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [articles, setArticles] = useState([]);
  const [avatarSeed] = useState(() => Math.random().toString(36).substring(7));
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useFavorite();

  // 获取所有文章
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`);
        if (response.data.success) {
          setArticles(response.data.data.items || []);
        }
      } catch (error) {
        console.error('获取文章失败:', error);
      }
    };
    fetchArticles();
  }, []);

  // 处理搜索
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // 对每篇文章计算相关度分数
    const results = articles.map(article => {
      const titleScore = fuzzyMatch(article.title, query) * 2; // 标题权重加倍
      const descScore = article.description ? fuzzyMatch(article.description, query) : 0;
      const tagsScore = article.tags ? Math.max(...article.tags.map(tag => fuzzyMatch(tag, query))) : 0;
      const categoryScore = article.category ? fuzzyMatch(article.category, query) : 0;
      
      const totalScore = (titleScore * 2 + descScore + tagsScore + categoryScore) / 5;
      
      return {
        ...article,
        score: totalScore
      };
    });
    
    // 过滤和排序结果
    const filteredResults = results
      .filter(result => result.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    setSearchResults(filteredResults);
    setShowResults(true);
  };

  // 处理搜索结果点击
  const handleResultClick = (article) => {
    navigate(`/post/${article.id}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  // 处理回车搜索
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('search', searchQuery);
      navigate(`/?${searchParams.toString()}`);
      setShowResults(false);
    }
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getAvatarContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
          <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      );
    }

    if (user?.avatar) {
      return (
        <div className="relative">
          <img
            className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-800"
            src={user.avatar}
            alt={user.name || 'User avatar'}
          />
        </div>
      );
    }

    // 生成用户名首字母头像
    const initials = user?.name
      ? user.name.split(' ').map(word => word[0].toUpperCase()).join('')
      : 'U';
    
    return (
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center
                      text-indigo-600 dark:text-indigo-300 font-medium text-sm">
          {initials}
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400 
                                    hover:text-indigo-500 transition-colors duration-300 ease-in-out">
                Explore AI
              </Link>
            </div>

            {/* 导航链接 */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) => `
                      relative h-16 inline-flex items-center px-3 text-sm font-medium transition-all duration-300 ease-out
                      ${isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400'
                      }
                      group
                    `}
                  >
                    {link.name}
                    <span className={`
                      absolute bottom-0 left-0 w-full h-0.5
                      transform transition-all duration-300 ease-out
                      ${isActive
                        ? 'bg-indigo-500 scale-x-100'
                        : 'bg-indigo-400 scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-50'
                      }
                    `} />
                  </NavLink>
                );
              })}
            </div>

            {/* 搜索框 */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs search-container relative">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 
                                                  transition-colors duration-300 ease-in-out" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full pl-11 pr-4 py-2.5 
                             bg-gray-50 dark:bg-gray-800/50
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400
                             rounded-full
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                             focus:border-indigo-500 dark:focus:border-indigo-500
                             hover:border-gray-300 dark:hover:border-gray-600
                             text-sm
                             shadow-sm
                             transition-all duration-300 ease-in-out"
                    placeholder="探索文章..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* 搜索结果下拉框 */}
                {showResults && searchQuery && (
                  <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                                ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
                    <div className="py-1">
                      {searchResults.length > 0 ? (
                        searchResults.map((article) => (
                          <div
                            key={article.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleResultClick(article)}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {article.title}
                            </div>
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {article.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                             bg-indigo-100 dark:bg-indigo-900 
                                             text-indigo-800 dark:text-indigo-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          未找到相关文章
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 用户菜单 - 桌面端 */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="group flex rounded-full bg-white dark:bg-gray-800 
                                    ring-2 ring-gray-100 dark:ring-gray-700
                                    hover:ring-indigo-200 dark:hover:ring-indigo-800
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                    focus:ring-offset-2 transform transition-all duration-300 
                                    ease-in-out hover:shadow-lg hover:scale-105">
                <span className="sr-only">Open user menu</span>
                {getAvatarContent()}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 translate-y-2"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-60 origin-top-right rounded-2xl bg-white dark:bg-gray-800 
                                     py-2 shadow-xl ring-1 ring-gray-100/5 dark:ring-white/5 focus:outline-none translate-x-full">

                  {isAuthenticated ? (
                    <>
                      {/* 用户信息 */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          {user?.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                              src={user.avatar}
                              alt={user.name || 'User avatar'}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                              {user?.name
                                ? user.name.split(' ').map(word => word[0].toUpperCase()).join('')
                                : 'U'}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user?.name || '用户'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user?.email || '未设置邮箱'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-1.5">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/favorites"
                              className={`
                                group flex items-center px-4 py-2.5 text-sm
                                ${active ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                              `}
                            >
                              <BookmarkIcon 
                                className={`mr-3 h-5 w-5 ${
                                  active ? 'text-indigo-500' : 'text-gray-400'
                                } group-hover:text-indigo-500 transition-colors duration-200`} 
                                aria-hidden="true" 
                              />
                              <span className={`${
                                active ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                              }`}>
                                收藏文章
                              </span>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`
                                group flex w-full items-center px-4 py-2.5 text-sm
                                ${active ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                              `}
                            >
                              <ArrowRightOnRectangleIcon 
                                className={`mr-3 h-5 w-5 ${
                                  active ? 'text-indigo-500' : 'text-gray-400'
                                } group-hover:text-indigo-500 transition-colors duration-200`} 
                                aria-hidden="true" 
                              />
                              <span className={`${
                                active ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                              }`}>
                                退出登录
                              </span>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </>
                  ) : (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogin}
                          className={`
                            group flex w-full items-center px-4 py-2.5 text-sm
                            ${active ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                          `}
                        >
                          <ArrowLeftOnRectangleIcon 
                            className={`mr-3 h-5 w-5 ${
                              active ? 'text-indigo-500' : 'text-gray-400'
                            } group-hover:text-indigo-500 transition-colors duration-200`} 
                            aria-hidden="true" 
                          />
                          <span className={`${
                            active ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                          }`}>
                            登录
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 底部边框 */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-700" />

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => classNames(
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200'
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="pt-2 px-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="探索文章..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full
                         text-sm placeholder-gray-500 bg-gray-50 focus:bg-white
                         focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                         hover:border-gray-300 dark:hover:border-gray-600"
              />
            </div>
          </div>
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                to="/favorites"
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <BookmarkIcon className="mr-3 h-6 w-6 text-gray-400" />
                收藏文章
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 text-gray-400" />
                退出登录
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 text-gray-400" />
              登录
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
