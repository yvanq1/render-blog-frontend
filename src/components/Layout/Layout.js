import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Common/Footer';
import FloatingThemeToggle from '../UI/FloatingThemeToggle';

function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <FloatingThemeToggle />}
    </div>
  );
}

export default Layout;
