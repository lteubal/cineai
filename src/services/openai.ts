import axios from 'axios';
import { Movie } from '../types/movie';

const OPENAI_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openaiApi = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const openaiService = {
  getMovieRecommendations: async (movie: Movie, userPreferences?: string): Promise<{ text: string; movieTitles: string[] }> => {
    const prompt = `Based on the movie "${movie.title}" (${movie.release_date?.split('-')[0]}) with the following description: "${movie.overview}", please recommend 5 similar movies and explain why each would appeal to someone who enjoyed this film. 
    
    ${userPreferences ? `User preferences: ${userPreferences}` : ''}
    
    Please format your response in a clear, engaging way with movie titles in bold and brief explanations for each recommendation. Focus on movies that share similar themes, genres, or storytelling styles.
    
    IMPORTANT: At the end of your response, add a line starting with "MOVIE_TITLES:" followed by just the 5 movie titles separated by commas, without any formatting or explanations. For example: "MOVIE_TITLES: Inception, The Matrix, Blade Runner, Ex Machina, Her"`;

    try {
      const response = await openaiApi.post('/chat/completions', {
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
      });

      const content = response.data.choices[0].message.content;
      
      // Extract movie titles from the response
      const movieTitlesMatch = content.match(/MOVIE_TITLES:\s*(.+)$/m);
      const movieTitles = movieTitlesMatch 
        ? movieTitlesMatch[1].split(',').map((title: string) => title.trim())
        : [];
      
      // Remove the MOVIE_TITLES line from the text
      const text = content.replace(/\nMOVIE_TITLES:.*$/m, '').trim();

      return { text, movieTitles };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get AI recommendations');
    }
  },

  getMovieAnalysis: async (movie: Movie): Promise<string> => {
    const prompt = `Analyze the movie "${movie.title}" and provide insights about its themes, cinematography, storytelling, and cultural impact. Keep it concise but informative (max 200 words).`;

    try {
      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a film analyst providing thoughtful movie insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.6,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get AI analysis');
    }
  },
};