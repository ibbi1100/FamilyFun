# Chaos Control ⚡️

A gamified family mission app powered by Google Gemini AI.

## Features

- **Chaos Missions**: AI-generated challenges for Dads and Sons.
- **Monster Mashup**: Create silly monsters with randomized parts.
- **Story Spinner**: AI-powered interactive storytelling.
- **Silly Soundboard**: Synthesized sound effects engine.
- **Player Stats**: Track XP, streaks, and levels.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd adventure-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_google_gemini_api_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment (Docker/Dokploy)

This project includes a `Dockerfile` and `nginx.conf` for easy deployment.

1. **Build Args**: Ensure you pass `API_KEY` as a build argument or environment variable during the build process in your deployment platform.
2. **Port**: The container exposes port `80`.

### Docker Build Command
```bash
docker build --build-arg API_KEY=your_key_here -t chaos-control .
```

### Docker Run Command
```bash
docker run -p 3000:80 chaos-control
```
