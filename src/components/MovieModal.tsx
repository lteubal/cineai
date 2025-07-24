import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, Globe, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { Movie, MovieDetails } from '../types/movie';
import { tmdbService } from '../services/tmdb';
import { openaiService } from '../services/openai';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onSimilarMovieClick?: (movie: Movie) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose, onSimilarMovieClick }) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [aiRecommendedMovies, setAiRecommendedMovies] = useState<Movie[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'similar'>('details');

  useEffect(() => {
    if (movie && isOpen) {
      loadMovieData();
    }
  }, [movie, isOpen]);

  const loadMovieData = async () => {
    if (!movie) return;

    setIsLoadingDetails(true);
    setIsLoadingAI(true);

    try {
      // Load movie details
      const details = await tmdbService.getMovieDetails(movie.id);
      setMovieDetails(details);

      // Load movie recommendations (more accurate than similar movies)
      const movieRecommendations = await tmdbService.getRecommendations(movie.id);
      setSimilarMovies(movieRecommendations.results.slice(0, 6));

      setIsLoadingDetails(false);

      // Load AI recommendations
      const aiResult = await openaiService.getMovieRecommendations(movie);
      setAiRecommendations(aiResult.text);
      
      // Fetch the actual movie data for AI recommendations
      const aiMovies: Movie[] = [];
      for (const title of aiResult.movieTitles) {
        const movieData = await tmdbService.searchMoviesByTitle(title);
        if (movieData) {
          aiMovies.push(movieData);
        }
      }
      setAiRecommendedMovies(aiMovies);
      setIsLoadingAI(false);
    } catch (error) {
      console.error('Error loading movie data:', error);
      setIsLoadingDetails(false);
      setIsLoadingAI(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(amount);
  };

  if (!movie) return null;

    return (
    <Dialog
      as={motion.div}
      static
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl custom-scrollbar">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
                {/* Header with backdrop */}
                <div className="relative">
                  <div className="absolute inset-0">
                    <img
                      src={tmdbService.getImageUrl(movie.backdrop_path, 'w1280')}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent" />
                  </div>
                  
                  <div className="relative p-6">
                    <button
                      onClick={onClose}
                      className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <motion.img
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
                        alt={movie.title}
                        className="w-56 h-84 object-cover rounded-2xl shadow-2xl"
                      />

                      <div className="flex-1 space-y-4">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-4xl font-bold text-gray-900 dark:text-white"
                        >
                          {movie.title}
                        </motion.h1>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              ({movie.vote_count} votes)
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                          </div>

                          {movieDetails?.runtime && (
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <Clock className="w-5 h-5" />
                              <span>{formatRuntime(movieDetails.runtime)}</span>
                            </div>
                          )}
                        </motion.div>

                        {movieDetails?.genres && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-2"
                          >
                            {movieDetails.genres.map((genre) => (
                              <span
                                key={genre.id}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </motion.div>
                        )}

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                        >
                          {movie.overview}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-8">
                  <nav className="flex space-x-8">
                    {[
                      { key: 'details', label: 'Details', icon: Globe },
                      { key: 'ai', label: 'AI Recommendations', icon: Sparkles },
                      { key: 'similar', label: 'TMDB Recommendations', icon: Star },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key as any)}
                        className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === key
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {isLoadingDetails ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                      ) : movieDetails ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <div className="space-y-4">
                            {movieDetails.tagline && (
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tagline</h3>
                                <p className="text-gray-700 dark:text-gray-300 italic">"{movieDetails.tagline}"</p>
                              </div>
                            )}
                            
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                              <p className="text-gray-700 dark:text-gray-300">{movieDetails.status}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Original Language</h3>
                              <p className="text-gray-700 dark:text-gray-300">{movieDetails.original_language.toUpperCase()}</p>
                            </div>

                            {movieDetails.runtime > 0 && (
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Runtime</h3>
                                <p className="text-gray-700 dark:text-gray-300">{formatRuntime(movieDetails.runtime)}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            {movieDetails.budget > 0 && (
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Budget</h3>
                                <p className="text-gray-700 dark:text-gray-300">{formatCurrency(movieDetails.budget)}</p>
                              </div>
                            )}

                            {movieDetails.revenue > 0 && (
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Revenue</h3>
                                <p className="text-gray-700 dark:text-gray-300">{formatCurrency(movieDetails.revenue)}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            {movieDetails.release_date && (
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Release Date</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {new Date(movieDetails.release_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}

                            {movieDetails.production_companies.length > 0 && (
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Production Companies</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {movieDetails.production_companies.map(c => c.name).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  )}

                  {activeTab === 'ai' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {isLoadingAI ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">Getting AI recommendations...</p>
                          </div>
                        </div>
                      ) : aiRecommendations ? (
                        <>
                          {/* AI Text Recommendations */}
                          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                            <ReactMarkdown 
                              components={{
                                h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{children}</h1>,
                                h2: ({children}) => <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{children}</h2>,
                                h3: ({children}) => <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{children}</h3>,
                                p: ({children}) => <p className="mb-4 text-gray-700 dark:text-gray-300">{children}</p>,
                                strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                                em: ({children}) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
                                ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                                li: ({children}) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                              }}
                            >
                              {aiRecommendations}
                            </ReactMarkdown>
                          </div>

                          {/* Clickable Movie Recommendations */}
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Recommended Movies to Watch
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {aiRecommendedMovies.map((recommendedMovie) => (
                                <div
                                  key={recommendedMovie.id}
                                  onClick={() => onSimilarMovieClick?.(recommendedMovie)}
                                  className="group cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                  <img
                                    src={tmdbService.getImageUrl(recommendedMovie.poster_path, 'w300')}
                                    alt={recommendedMovie.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="p-3">
                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                                      {recommendedMovie.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span>{recommendedMovie.vote_average.toFixed(1)}</span>
                                      <span>•</span>
                                      <span>{new Date(recommendedMovie.release_date).getFullYear()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                          Failed to load AI recommendations. Please try again.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'similar' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {similarMovies.map((similarMovie) => (
                        <div
                          key={similarMovie.id}
                          onClick={() => onSimilarMovieClick?.(similarMovie)}
                          className="group cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          <img
                            src={tmdbService.getImageUrl(similarMovie.poster_path, 'w300')}
                            alt={similarMovie.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="p-3">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                              {similarMovie.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{similarMovie.vote_average.toFixed(1)}</span>
                              <span>•</span>
                              <span>{new Date(similarMovie.release_date).getFullYear()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Dialog.Panel>
            </div>
          </div>
        </Dialog>
  );
};