# altitude Forms

A standalone form builder application with AI-powered features, part of the altitude workspace platform.

## Features

- 📋 Drag-and-drop form builder with multiple field types
- 🤖 AI Sidekick for auto-generating form fields
- 📊 Real-time analytics and response tracking
- 🔗 Public form sharing via unique URLs
- 📱 Responsive design

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3003`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anon key |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI features |

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js server (bundled with Vite in dev mode)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API (optional)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/forms` | List all forms (auth required) |
| POST | `/api/forms` | Create a new form |
| PUT | `/api/forms/:id` | Update a form |
| DELETE | `/api/forms/:id` | Delete a form |
| GET | `/api/forms/public/:id` | Get form data (public) |
| POST | `/api/forms/:id/respond` | Submit a response (public) |
| GET | `/api/forms/:id/responses` | Get form responses (auth required) |
| POST | `/api/ai/sidekick` | AI form generation |

## License

Part of the altitude workspace platform.
