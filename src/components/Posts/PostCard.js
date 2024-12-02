import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline';

const PostCard = ({ post }) => {
  return (
    <Link 
      to={`/post/${post._id}`}
      className="group block overflow-hidden rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-all duration-300 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/30"
    >
      {/* 封面图 */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.coverImage || `https://picsum.photos/800/450?random=${post._id}`}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {post.tags[0]}
            </span>
          </div>
        )}

        {/* 标题 */}
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
          {post.title}
        </h3>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="h-4 w-4" />
            <span>{post.views || 0} 次浏览</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
