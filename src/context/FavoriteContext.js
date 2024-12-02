import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // 从localStorage加载收藏列表
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // 保存收藏列表到localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // 添加收藏
  const addFavorite = (post) => {
    if (!favorites.some(fav => fav.id === post.id)) {
      setFavorites([...favorites, post]);
    }
  };

  // 移除收藏
  const removeFavorite = (postId) => {
    setFavorites(favorites.filter(post => post.id !== postId));
  };

  // 检查是否已收藏
  const isFavorite = (postId) => {
    return favorites.some(post => post.id === postId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}
