import axios from 'axios';
import { Movie, MovieDetails, TMDBResponse } from '../types/movie';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const tmdbService = {
  // Search movies
  searchMovies: async (query: string, page = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  },

  // Get popular movies
  getPopularMovies: async (page = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`);
    return response.data;
  },

  // Get movie recommendations
  getRecommendations: async (movieId: number): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`);
    return response.data;
  },

  // Search for movies by title
  searchMoviesByTitle: async (title: string): Promise<Movie | null> => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query: title, page: 1 },
      });
      
      if (response.data.results && response.data.results.length > 0) {
        // Return the first (most relevant) result
        return response.data.results[0];
      }
      return null;
    } catch (error) {
      console.error(`Error searching for movie: ${title}`, error);
      return null;
    }
  },

  // Helper function to get full image URL
  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.jpg';
    return `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};