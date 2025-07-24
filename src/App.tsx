import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { ThemeToggle } from './components/ThemeToggle';
import { LoadingSkeleton, HeroSkeleton } from './components/LoadingSkeleton';
import { useTheme } from './hooks/useTheme';
import { tmdbService } from './services/tmdb';
import { Movie } from './types/movie';

function App() {
  const { theme } = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadTrendingMovies = async () => {
    try {
      setIsInitialLoading(true);
      const response = await tmdbService.getTrendingMovies();
      setTrendingMovies(response.results || []);
      setMovies(response.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to load trending movies. Please check your API configuration.');
      console.error('Error loading trending movies:', err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setMovies(trendingMovies);
      setSearchQuery('');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSearchQuery(query);
      
      const response = await tmdbService.searchMovies(query);
      setMovies(response.results || []);
      
      if ((response.results || []).length === 0) {
        setError(`No movies found for "${query}". Try a different search term.`);
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Error searching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMovies(trendingMovies);
    setError(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Film className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CineAI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-Powered Movie Discovery
              </p>
            </div>
          </motion.div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        {isInitialLoading ? (
          <HeroSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 mb-16"
          >
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white"
              >
                Discover Your Next
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Favorite Movie
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              >
                Search through millions of movies and get personalized AI-powered recommendations 
                tailored to your taste. Powered by TMDB and ChatGPT.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center space-x-4"
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Recommendations</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending Movies</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                <Film className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Info</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Results Section */}
        <div className="space-y-8">
          {/* Section Header */}
          <AnimatePresence mode="wait">
            {!isInitialLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Movies'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {searchQuery ? `${movies.length} movies found` : 'Popular movies this week'}
                  </p>
                </div>
                
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
                  >
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  {error}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={searchQuery ? () => handleSearch(searchQuery) : loadTrendingMovies}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Movies Grid */}
          {isInitialLoading ? (
            <LoadingSkeleton />
          ) : !error && movies.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : null}
        </div>
      </main>

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={closeModal}
        onSimilarMovieClick={handleMovieClick}
      />
    </div>
  );
}

export default App;