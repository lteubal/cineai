import { Movie, TMDBResponse } from '../types/movie';
import { tmdbService } from './tmdb';
import { openaiService } from './openai';

export const intelligentSearchService = {
  // Detect if the query is a thematic search or a direct movie search
  isThematicSearch: (query: string): boolean => {
    const thematicKeywords = [
      'movies that', 'films that', 'stories about', 'films about', 'movies about',
      'love', 'romance', 'action', 'adventure', 'comedy', 'drama', 'horror', 'thriller',
      'sci-fi', 'science fiction', 'fantasy', 'mystery', 'crime', 'war', 'western',
      'musical', 'documentary', 'animation', 'family', 'children', 'teen',
      'emotional', 'thought-provoking', 'mind-bending', 'heartwarming', 'inspiring',
      'sad', 'happy', 'funny', 'scary', 'exciting', 'relaxing', 'educational',
      'time travel', 'space', 'robots', 'aliens', 'magic', 'superheroes', 'vampires',
      'zombies', 'ghosts', 'monsters', 'animals', 'nature', 'history', 'future',
      'past', 'present', 'world war', 'civil war', 'revolution', 'independence',
      'freedom', 'justice', 'revenge', 'redemption', 'forgiveness', 'friendship',
      'family', 'parenting', 'marriage', 'divorce', 'dating', 'breakup', 'reunion',
      'coming of age', 'growing up', 'adulthood', 'old age', 'death', 'life',
      'success', 'failure', 'dreams', 'ambition', 'career', 'business', 'money',
      'poverty', 'wealth', 'class', 'society', 'politics', 'government', 'religion',
      'spirituality', 'philosophy', 'science', 'technology', 'art', 'music',
      'dance', 'sports', 'competition', 'teamwork', 'individual', 'society',
      'culture', 'tradition', 'modern', 'classic', 'contemporary', 'period',
      'medieval', 'ancient', 'modern', 'futuristic', 'post-apocalyptic',
      'dystopian', 'utopian', 'realistic', 'fantasy', 'surreal', 'abstract'
    ];

    const lowerQuery = query.toLowerCase();
    
    // Check for thematic keywords
    const hasThematicKeyword = thematicKeywords.some(keyword => lowerQuery.includes(keyword));
    
    // Check for actor/actress patterns (name + genre/type)
    const actorPatterns = [
      /\b\w+\s+\w+\s+(movies|films|comedies|dramas|action|horror|thriller|romance)\b/i,
      /\b\w+\s+(murphy|smith|jones|brown|davis|wilson|taylor|anderson|thomas|jackson)\s+\w+\b/i
    ];
    
    const hasActorPattern = actorPatterns.some(pattern => pattern.test(query));
    
    return hasThematicKeyword || hasActorPattern;
  },

  // Curated movie lists for common themes
  getCuratedMovies: (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    // Movies that make you think
    if (lowerQuery.includes('think') || lowerQuery.includes('thought-provoking') || lowerQuery.includes('mind-bending')) {
      return [
        'Inception',
        'The Matrix',
        'Interstellar',
        'Blade Runner',
        'Eternal Sunshine of the Spotless Mind',
        'The Truman Show',
        'Fight Club',
        'Memento',
        'Donnie Darko',
        'The Prestige'
      ];
    }
    
    // Love stories / Romance
    if (lowerQuery.includes('love') || lowerQuery.includes('romance') || lowerQuery.includes('romantic')) {
      return [
        'The Notebook',
        'Titanic',
        'La La Land',
        'Before Sunrise',
        'Eternal Sunshine of the Spotless Mind',
        '500 Days of Summer',
        'The Princess Bride',
        'Casablanca',
        'When Harry Met Sally',
        'About Time'
      ];
    }
    
    // Action movies
    if (lowerQuery.includes('action')) {
      return [
        'Mad Max: Fury Road',
        'John Wick',
        'The Dark Knight',
        'Mission: Impossible',
        'Die Hard',
        'The Avengers',
        'Black Panther',
        'Wonder Woman',
        'Top Gun: Maverick',
        'The Matrix'
      ];
    }
    
    // Comedy
    if (lowerQuery.includes('comedy') || lowerQuery.includes('funny') || lowerQuery.includes('humor')) {
      return [
        'The Grand Budapest Hotel',
        'Superbad',
        'Bridesmaids',
        'The Hangover',
        'Shaun of the Dead',
        'Hot Fuzz',
        'The Big Lebowski',
        'Groundhog Day',
        'Office Space',
        'Mean Girls'
      ];
    }
    
    // Eddie Murphy movies
    if (lowerQuery.includes('eddie murphy')) {
      return [
        'Coming to America',
        'Beverly Hills Cop',
        'The Nutty Professor',
        'Dr. Dolittle',
        'Shrek',
        'Mulan',
        'Beverly Hills Cop II',
        'Trading Places',
        '48 Hrs.',
        'Bowfinger'
      ];
    }
    
    // Will Smith movies
    if (lowerQuery.includes('will smith')) {
      return [
        'Men in Black',
        'Independence Day',
        'The Pursuit of Happyness',
        'I Am Legend',
        'Hitch',
        'Bad Boys',
        'Ali',
        'The Legend of Bagger Vance',
        'Enemy of the State',
        'Wild Wild West'
      ];
    }
    
    // Tom Hanks movies
    if (lowerQuery.includes('tom hanks')) {
      return [
        'Forrest Gump',
        'Cast Away',
        'Saving Private Ryan',
        'The Green Mile',
        'Big',
        'Philadelphia',
        'Apollo 13',
        'Toy Story',
        'The Terminal',
        'Sleepless in Seattle'
      ];
    }
    
    // Leonardo DiCaprio movies
    if (lowerQuery.includes('leonardo dicaprio') || lowerQuery.includes('leo dicaprio')) {
      return [
        'Titanic',
        'Inception',
        'The Wolf of Wall Street',
        'The Revenant',
        'Catch Me If You Can',
        'The Departed',
        'Shutter Island',
        'Django Unchained',
        'The Great Gatsby',
        'Once Upon a Time in Hollywood'
      ];
    }
    
    // Sci-fi
    if (lowerQuery.includes('sci-fi') || lowerQuery.includes('science fiction') || lowerQuery.includes('space')) {
      return [
        'Interstellar',
        'The Martian',
        'Blade Runner 2049',
        'Arrival',
        'Ex Machina',
        'Her',
        'Gravity',
        'The Fifth Element',
        'District 9',
        'Moon'
      ];
    }
    
    // Horror
    if (lowerQuery.includes('horror') || lowerQuery.includes('scary')) {
      return [
        'The Shining',
        'A Quiet Place',
        'Get Out',
        'Hereditary',
        'The Conjuring',
        'It Follows',
        'The Babadook',
        'The Witch',
        'Midsommar',
        'Us'
      ];
    }
    
    // Adventure
    if (lowerQuery.includes('adventure')) {
      return [
        'Indiana Jones and the Raiders of the Lost Ark',
        'The Lord of the Rings: The Fellowship of the Ring',
        'Jurassic Park',
        'Pirates of the Caribbean: The Curse of the Black Pearl',
        'The Princess Bride',
        'The Goonies',
        'Jumanji',
        'National Treasure',
        'The Mummy',
        'Romancing the Stone'
      ];
    }
    
    // Time travel
    if (lowerQuery.includes('time travel') || lowerQuery.includes('time')) {
      return [
        'Back to the Future',
        'Interstellar',
        'Looper',
        'Edge of Tomorrow',
        'About Time',
        'The Time Traveler\'s Wife',
        'Primer',
        '12 Monkeys',
        'Source Code',
        'Arrival'
      ];
    }
    
    // Emotional / Heartwarming
    if (lowerQuery.includes('emotional') || lowerQuery.includes('heartwarming') || lowerQuery.includes('feel-good')) {
      return [
        'The Shawshank Redemption',
        'Forrest Gump',
        'The Green Mile',
        'Big Fish',
        'The Secret Life of Walter Mitty',
        'Up',
        'The Pursuit of Happyness',
        'Good Will Hunting',
        'Dead Poets Society',
        'The Blind Side'
      ];
    }
    
    // Default fallback for other themes
    return [
      'Inception',
      'The Matrix',
      'The Dark Knight',
      'Interstellar',
      'The Shawshank Redemption',
      'Forrest Gump',
      'Pulp Fiction',
      'Fight Club',
      'The Godfather',
      'Schindler\'s List'
    ];
  },

  // Search movies using curated lists for thematic queries
  searchThematic: async (query: string): Promise<Movie[]> => {
    try {
      console.log('Starting thematic search for:', query);
      
      // Get curated movie titles for the theme
      const movieTitles = intelligentSearchService.getCuratedMovies(query);
      console.log('Curated movies:', movieTitles);
      
      // Fetch movie data for each title
      const movies: Movie[] = [];
      for (const title of movieTitles) {
        try {
          console.log('Searching for movie:', title);
          const movieData = await tmdbService.searchMoviesByTitle(title);
          if (movieData) {
            console.log('Found movie:', movieData.title);
            movies.push(movieData);
          } else {
            console.log('Movie not found:', title);
          }
        } catch (searchError) {
          console.warn(`Could not find movie: ${title}`, searchError);
        }
      }

      console.log('Total movies found:', movies.length);

      // If we couldn't find any movies, try a fallback approach
      if (movies.length === 0) {
        console.log('No movies found via curated list, trying fallback search...');
        // Fallback to TMDB search with the original query
        const fallbackResponse = await tmdbService.searchMovies(query);
        return fallbackResponse.results || [];
      }

      return movies;
    } catch (error) {
      console.error('Error in thematic search:', error);
      // Fallback to traditional search if everything fails
      try {
        const fallbackResponse = await tmdbService.searchMovies(query);
        return fallbackResponse.results || [];
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        throw new Error(`We couldn't find movies for "${query}". Try searching for a specific movie title or a different theme.`);
      }
    }
  },

  // Main search function that routes to appropriate method
  search: async (query: string): Promise<Movie[]> => {
    if (intelligentSearchService.isThematicSearch(query)) {
      // Use AI for thematic searches
      return await intelligentSearchService.searchThematic(query);
    } else {
      // Use traditional TMDB search for direct movie searches
      const response = await tmdbService.searchMovies(query);
      return response.results || [];
    }
  }
}; 