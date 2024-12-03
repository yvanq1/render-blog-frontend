import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import Pagination from '../components/Pagination';
import { API_URL } from '../config/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/favorites?page=${page}&limit=${limit}`, {
          withCredentials: true
        });
        if (response.data.success) {
          setFavorites(response.data.data.favorites);
          setTotalPages(Math.ceil(response.data.data.total / limit));
        }
      } catch (error) {
        console.error('获取收藏列表失败:', error);
        setError('获取收藏列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              请稍后重试或联系管理员
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              暂无收藏文章
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              浏览文章时点击心形图标即可收藏喜欢的文章
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              浏览文章
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-morandi-beige/70 via-morandi-rose/50 to-morandi-blue/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          我的收藏
        </h1>

        <div className="space-y-6">
          {favorites.map((favorite) => (
            <article
              key={favorite.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <Link to={`/post/${favorite.articleId}`} className="block p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                      {favorite.article.title}
                    </h2>

                    {/* 文章元信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <time dateTime={favorite.article.createdAt}>
                          {new Date(favorite.article.createdAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>

                      {favorite.article.category && (
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-4 w-4" />
                          <span>{favorite.article.category}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 文章封面图 */}
                  {favorite.article.coverImage && (
                    <div className="ml-6 flex-shrink-0">
                      <img
                        src={favorite.article.coverImage}
                        alt={favorite.article.title}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
