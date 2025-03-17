# XBeats: A Next.js Music Streaming Web App

XBeats is a modern, feature-rich music streaming web application built with Next.js. It offers a seamless and immersive music listening experience with a wide range of features for discovering, playing, and managing your favorite tunes.

## Project Description

XBeats is designed to provide users with a comprehensive music streaming platform. It leverages the power of Next.js for server-side rendering and efficient client-side navigation, resulting in a fast and responsive user interface. The application integrates with a music API to fetch and display a vast library of songs, albums, artists, and playlists.

Key features of XBeats include:

- User authentication and personalized libraries
- Music playback with advanced controls (play, pause, skip, shuffle, repeat)
- Playlist creation and management
- Search functionality across songs, albums, artists, and playlists
- Personalized recommendations
- Lyrics display
- Mobile-responsive design

The application uses a PostgreSQL database (managed through Drizzle ORM) to store user data, playlists, and library information. It also incorporates real-time updates and caching strategies to ensure a smooth user experience.

## Repository Structure

```
.
├── src/
│   ├── actions/
│   ├── app/
│   │   ├── (root)/
│   │   ├── api/
│   │   └── globals.css
│   ├── atoms/
│   ├── components/
│   │   ├── blocks/
│   │   └── ui/
│   ├── db/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── public/
├── components.json
├── drizzle.config.ts
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

Key Files:
- `src/app/layout.tsx`: The main layout component for the application
- `src/components/blocks/player/index.tsx`: The main audio player component
- `src/lib/music-api-instance.ts`: API client for interacting with the music service
- `src/db/schema.ts`: Database schema definitions
- `drizzle.config.ts`: Configuration for the Drizzle ORM
- `tailwind.config.ts`: Tailwind CSS configuration

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14 or later)
- PostgreSQL database

Steps:
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env.local` and fill in the values)
4. Run database migrations: `npm run db:push`

### Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

### Configuration

Key configuration options:
- `DATABASE_URL`: PostgreSQL connection string
- `MUSIC_API_BASE_URL`: Base URL for the music API
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials

### Common Use Cases

1. Playing a song:
   ```typescript
   const { handlePlay } = useContext(PlayerContext);
   handlePlay(songToken, "song");
   ```

2. Creating a playlist:
   ```typescript
   const newPlaylist = await createNewPlaylist({ userId, name, description });
   ```

3. Searching for content:
   ```typescript
   const results = await search(query, "song");
   ```

### Testing & Quality

To run tests (if implemented):
```bash
npm test
```

### Troubleshooting

Common Issue: Audio playback not working
- Check if the `MUSIC_API_BASE_URL` is correctly set in your environment variables
- Ensure that you have an active internet connection
- Check the browser console for any error messages related to CORS or API requests

Debug Mode:
To enable verbose logging, set `DEBUG=true` in your `.env.local` file.

## Data Flow

1. User interacts with the UI (e.g., clicks play on a song)
2. React component triggers an action (e.g., `handlePlay` from PlayerContext)
3. Action makes an API request to the music service via `music-api-instance.ts`
4. API response is processed and stored in application state (using Jotai atoms)
5. UI updates to reflect the new state (e.g., audio player shows new song info)

```
[User Interface] -> [React Components] -> [Context/Actions] -> [API Client]
     ^                                                              |
     |                                                              v
[State Update] <- [Jotai Atoms] <- [Data Processing] <- [API Response]
```

## Deployment

Prerequisites:
- Vercel account (recommended) or any Node.js hosting platform
- PostgreSQL database (e.g., Supabase, Railway)

Steps:
1. Set up a new project on Vercel and link it to your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy the application

Monitoring:
Use Vercel Analytics or integrate a third-party monitoring solution like Sentry for error tracking and performance monitoring.

## Infrastructure

The application uses the following key infrastructure resources:

Lambda Functions:
- API routes defined in `src/app/api/`

Database Tables (defined in `src/db/schema.ts`):
- `users`: Stores user information
- `accounts`: Manages OAuth accounts
- `sessions`: Handles user sessions
- `verificationTokens`: Manages email verification tokens
- `authenticators`: Stores WebAuthn authenticator information
- `userPlaylists`: Manages user-created playlists
- `libraries`: Stores user's library items (songs, albums, playlists, artists, podcasts)