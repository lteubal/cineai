const {onRequest} = require("firebase-functions/v2/https");
const {defineString} = require("firebase-functions/params");
const cors = require('cors')({ origin: true });
const axios = require('axios');

const TMDB_API_KEY = defineString("TMDB_KEY");
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const OPENAI_API_KEY = defineString("OPENAI_KEY");
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

exports.testFunction = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, () => {
    res.json({ 
      message: 'Firebase Functions are working!',
      timestamp: new Date().toISOString(),
      config: {
        tmdb: !!TMDB_API_KEY.value(),
        openai: !!OPENAI_API_KEY.value()
      }
    });
  });
});

exports.searchMovies = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!TMDB_API_KEY.value()) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
      }
      
      const { query, page = 1 } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY.value(),
          query,
          page
        }
      });

      res.json(response.data);
    } catch (error) {
      console.error('TMDB Search Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to search movies' });
    }
  });
});

exports.getTrendingMovies = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!TMDB_API_KEY.value()) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
      }
      
      const { timeWindow = 'week' } = req.query;
      
      const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/${timeWindow}`, {
        params: {
          api_key: TMDB_API_KEY
        }
      });

      res.json(response.data);
    } catch (error) {
      console.error('TMDB Trending Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get trending movies' });
    }
  });
});

exports.getMovieDetails = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!TMDB_API_KEY.value()) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
      }
      
      const { movieId } = req.query;
      
      if (!movieId) {
        return res.status(400).json({ error: 'Movie ID is required' });
      }

      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_API_KEY
        }
      });

      res.json(response.data);
    } catch (error) {
      console.error('TMDB Movie Details Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get movie details' });
    }
  });
});

exports.getMovieRecommendations = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!TMDB_API_KEY.value()) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
      }
      
      const { movieId } = req.query;
      
      if (!movieId) {
        return res.status(400).json({ error: 'Movie ID is required' });
      }

      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/recommendations`, {
        params: {
          api_key: TMDB_API_KEY
        }
      });

      res.json(response.data);
    } catch (error) {
      console.error('TMDB Recommendations Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get movie recommendations' });
    }
  });
});

exports.getSimilarMovies = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!TMDB_API_KEY.value()) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
      }
      
      const { movieId } = req.query;
      
      if (!movieId) {
        return res.status(400).json({ error: 'Movie ID is required' });
      }

      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/similar`, {
        params: {
          api_key: TMDB_API_KEY
        }
      });

      res.json(response.data);
    } catch (error) {
      console.error('TMDB Similar Movies Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get similar movies' });
    }
  });
});

exports.searchMoviesByTitle = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!TMDB_API_KEY.value()) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
      }
      
      const { title } = req.query;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY.value(),
          query: title,
          page: 1
        }
      });

      const movie = response.data.results && response.data.results.length > 0 
        ? response.data.results[0] 
        : null;

      res.json({ movie });
    } catch (error) {
      console.error('TMDB Search by Title Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to search movie by title' });
    }
  });
});

exports.getAIRecommendations = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!OPENAI_API_KEY.value()) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }
      
      const { movie, userPreferences } = req.body;
      
      if (!movie) {
        return res.status(400).json({ error: 'Movie data is required' });
      }

      const prompt = `Based on the movie "${movie.title}" (${movie.release_date?.split('-')[0]}) with the following description: "${movie.overview}", please recommend 5 similar movies and explain why each would appeal to someone who enjoyed this film. 
      
      ${userPreferences ? `User preferences: ${userPreferences}` : ''}
      
      Please format your response in a clear, engaging way with movie titles in bold and brief explanations for each recommendation. Focus on movies that share similar themes, genres, or storytelling styles.
      
      IMPORTANT: At the end of your response, add a line starting with "MOVIE_TITLES:" followed by just the 5 movie titles separated by commas, without any formatting or explanations. For example: "MOVIE_TITLES: Inception, The Matrix, Blade Runner, Ex Machina, Her"`;

      const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable movie critic and recommendation expert. Provide thoughtful, accurate movie recommendations with engaging explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY.value()}`,
          'Content-Type': 'application/json',
        }
      });

      const content = response.data.choices[0].message.content;
      
      // Extract movie titles from the response
      const movieTitlesMatch = content.match(/MOVIE_TITLES:\s*(.+)$/m);
      const movieTitles = movieTitlesMatch 
        ? movieTitlesMatch[1].split(',').map((title) => title.trim())
        : [];
      
      // Remove the MOVIE_TITLES line from the text
      const text = content.replace(/\nMOVIE_TITLES:.*$/m, '').trim();

      res.json({ text, movieTitles });
    } catch (error) {
      console.error('OpenAI Recommendations Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get AI recommendations' });
    }
  });
});

exports.getThematicRecommendations = onRequest({invoker: 'public'}, (req, res) => {
  cors(req, res, async () => {
    try {
      if (!OPENAI_API_KEY.value()) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }
      
      const { theme, customPrompt } = req.body;
      
      if (!theme) {
        return res.status(400).json({ error: 'Theme is required' });
      }

      const prompt = customPrompt || `Find 10 movies that match this theme or concept: "${theme}". 
      
      Consider movies that:
      - Match the theme, concept, or emotion described
      - Are well-known and accessible
      - Have good ratings and reviews
      - Represent different genres and time periods
      
      Return only the movie titles separated by commas, no explanations or formatting.
      Example format: "Inception, Eternal Sunshine of the Spotless Mind, The Matrix, Blade Runner, Her"
      
      IMPORTANT: At the end of your response, add a line starting with "MOVIE_TITLES:" followed by just the 10 movie titles separated by commas, without any formatting or explanations.`;

      const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable movie recommendation expert. Provide accurate movie suggestions based on themes and concepts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY.value()}`,
          'Content-Type': 'application/json',
        }
      });

      const content = response.data.choices[0].message.content;
      
      // Extract movie titles from the response
      const movieTitlesMatch = content.match(/MOVIE_TITLES:\s*(.+)$/m);
      const movieTitles = movieTitlesMatch 
        ? movieTitlesMatch[1].split(',').map((title) => title.trim())
        : [];
      
      // Remove the MOVIE_TITLES line from the text
      const text = content.replace(/\nMOVIE_TITLES:.*$/m, '').trim();

      res.json({ text, movieTitles });
    } catch (error) {
      console.error('OpenAI Thematic Recommendations Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get thematic recommendations' });
    }
  });
});