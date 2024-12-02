import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Posts from './components/Posts/Posts';
import PostDetail from './pages/PostDetail';
import Favorites from './pages/Favorites';
import About from './components/About/About';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StableDiffusion from './pages/StableDiffusion';
import ComfyUI from './pages/ComfyUI';
import Midjourney from './pages/Midjourney';
import Others from './pages/Others';
import Gallery from './pages/Gallery';
import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Posts />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/stable-diffusion" element={<StableDiffusion />} />
              <Route path="/comfyui" element={<ComfyUI />} />
              <Route path="/midjourney" element={<Midjourney />} />
              <Route path="/others" element={<Others />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                    <p className="text-gray-600 dark:text-gray-400">页面未找到</p>
                  </div>
                </div>
              } />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </Router>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;
