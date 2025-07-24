import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          {/* Image skeleton */}
          <div className="relative">
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            
            {/* Rating badge skeleton */}
            <div className="absolute top-3 right-3 bg-gray-300 dark:bg-gray-600 rounded-full w-16 h-8 animate-pulse" />
          </div>

          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            </div>
            
            {/* Date skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="text-center space-y-8 mb-16">
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto max-w-md animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto max-w-lg animate-pulse" />
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      </div>
      
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
};