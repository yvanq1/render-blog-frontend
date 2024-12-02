import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-morandi-beige/70 via-morandi-rose/50 to-morandi-blue/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-16 w-16 text-indigo-500/70" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            AI Gallery
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-600 dark:text-gray-300">
            Coming Soon...
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We're working on something amazing!
          </p>
        </div>
      </div>
    </div>
  );
}
