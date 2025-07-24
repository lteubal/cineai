import React from 'react';
import { Star, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, index = 0 }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group cursor-pointer bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          onError={handleImageError}
          className="w-full h-80 object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>

        {/* Popularity indicator */}
        {movie.popularity > 100 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-3 py-1 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-medium">Popular</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {movie.overview || 'No description available.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {movie.vote_count} votes
              </span>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-yellow-600 dark:text-yellow-400 font-medium text-sm group-hover:underline"
          >
            View Details →
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};