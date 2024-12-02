import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EyeIcon, ClockIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import { postService } from '../../services/postService';
import { toast } from 'react-hot-toast';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postService.getPostById(id);
        setPost(data);
        // 增加浏览量
        await postService.incrementViews(id);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-1" />
            {post.readTime}
          </span>
          <span className="flex items-center">
            <EyeIcon className="h-5 w-5 mr-1" />
            {post.views} views
          </span>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map(tag => (
            <span
              key={tag.id}
              className={`${tag.color} px-3 py-1 rounded-full text-sm font-medium`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

export default PostDetail;
