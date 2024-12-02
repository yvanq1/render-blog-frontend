import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-center">
          {/* 关于部分 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">关于本站</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              这是一个完全由AI开发的博客项目，致力于为用户提供优质的内容。
            </p>
          </div>

          {/* 友情链接 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">友情链接</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  React
                </a>
              </li>
              <li>
                <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Tailwind CSS
                </a>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">联系方式</h3>
            <ul className="space-y-1 text-xs">
              <li className="text-gray-600 dark:text-gray-300">
                邮箱：example@example.com
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                GitHub：@yourusername
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <br />
        <div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p> {new Date().getFullYear()} My Blog. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;