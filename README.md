# CineAI - AI-Powered Movie Discovery Platform

A beautiful, modern web application for discovering movies with AI-powered recommendations using TMDB and ChatGPT APIs.

## Features

- 🎬 **Movie Search**: Search through millions of movies using TMDB API
- 🤖 **AI Recommendations**: Get personalized movie recommendations from ChatGPT
- 🌟 **Trending Movies**: Discover what's popular this week
- 🎨 **Beautiful UI**: Modern glassmorphism design with smooth animations
- 🌙 **Dark/Light Mode**: Toggle between themes with system preference detection
- 📱 **Responsive Design**: Optimized for all devices
- ⚡ **Fast Performance**: Built with Vite and optimized for production

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory and add your API keys:

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1

# Image Configuration
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 2. Get API Keys

#### TMDB API Key:
1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account and verify your email
3. Go to Settings > API
4. Request an API key (choose "Developer" option)
5. Fill out the form and get your API key

#### OpenAI API Key:
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new secret key
5. Copy the key (you won't be able to see it again)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Firebase Deployment

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created

### Deploy Steps

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase** (if not already done):
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

### Environment Variables for Production

For production deployment, you'll need to set your environment variables in your build process or hosting platform. The app uses Vite's environment variable system, so all variables must be prefixed with `VITE_`.

## Project Structure

```
src/
├── components/          # React components
│   ├── MovieCard.tsx   # Movie display card
│   ├── MovieModal.tsx  # Movie details modal
│   ├── SearchBar.tsx   # Search functionality
│   ├── ThemeToggle.tsx # Dark/light mode toggle
│   └── LoadingSkeleton.tsx # Loading states
├── hooks/              # Custom React hooks
│   └── useTheme.ts     # Theme management
├── services/           # API services
│   ├── tmdb.ts         # TMDB API integration
│   └── openai.ts       # OpenAI API integration
├── types/              # TypeScript types
│   └── movie.ts        # Movie-related types
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## API Usage

### TMDB Integration
- Search movies by title
- Get trending movies
- Fetch movie details
- Get similar movies
- High-quality movie posters and backdrops

### OpenAI Integration
- AI-powered movie recommendations
- Contextual movie analysis
- Personalized suggestions based on user preferences

## Performance Optimizations

- **Lazy Loading**: Images load on demand
- **Code Splitting**: Components loaded as needed
- **Caching**: Optimized Firebase hosting configuration
- **Responsive Images**: Multiple image sizes for different devices
- **Animation Optimization**: Framer Motion with reduced motion support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.