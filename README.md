# Chaos Control ⚡️

A gamified family mission app powered by Groq AI and Supabase.

## Features

- **Chaos Missions**: AI-generated challenges for Dads and Sons.
- **Monster Mashup**: Create silly monsters with randomized parts.
- **Story Spinner**: AI-powered interactive storytelling.
- **Silly Soundboard**: Synthesized sound effects engine.
- **Player Stats**: Track XP, streaks, and levels via Supabase.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth, Database, Realtime)
- Groq Cloud (AI generation)

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd FamilyFun
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GROQ_API_KEY`

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment (Docker/Dokploy)

This project includes a `Dockerfile` and `nginx.conf` for easy deployment.

1. **Build Args**: Ensure you pass the environment variables as build args.
2. **Port**: The container exposes port `80`.

### Docker Build Command
```bash
docker build \
  --build-arg VITE_SUPABASE_URL=... \
  --build-arg VITE_SUPABASE_ANON_KEY=... \
  --build-arg VITE_GROQ_API_KEY=... \
  -t chaos-control .
```

### Docker Run Command
```bash
docker run -p 3000:80 chaos-control
```
