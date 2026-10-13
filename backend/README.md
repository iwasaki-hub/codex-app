# Backend

Express API for the app, with JSON Server as a local development data store.

## Setup

From the repository root, install dependencies for the three folders and copy the example environment file:

```bash
cd backend
cp .env.example .env
npm install
cd ../frontend
npm install
cd ..
npm install
```

Set different random values for `JWT_SECRET` and `MOCK_API_KEY` in `backend/.env`. Each value must be at least 32 characters. Generate values with this command and run it twice:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

## Run locally

From the repository root, start the mock API, Express API, and frontend together:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`, the Express API at `http://127.0.0.1:3000`, and the protected JSON Server data store at `http://127.0.0.1:3001`. Press `Ctrl+C` to stop all three processes.

Open `http://127.0.0.1:3000/` to view the EJS API documentation page.

For running an individual service, use:

```bash
cd backend
npm run mock:api # JSON Server
npm run dev      # Express API (in another terminal)
```

```bash
cd frontend
npm run dev
```

Vite forwards `/api` requests to Express. The browser does not connect directly to the JSON Server data store.

## Authentication endpoints

- `POST /api/auth/register` accepts `{ "name", "email", "password" }` and returns a user and a one-hour JWT.
- `POST /api/auth/login` accepts `{ "email", "password" }` and returns a user and a one-hour JWT.
- `GET /api/auth/me` requires `Authorization: Bearer <token>` and returns the authenticated user.
- `GET /api/posts` returns published articles publicly. With `Authorization: Bearer <token>`, it also returns the signed-in user's private articles.
- `POST /api/posts` requires `Authorization: Bearer <token>` and accepts `{ "title", "content", "isPublished" }` to create an article. `isPublished` defaults to `true`.
- `PATCH /api/posts/:id/visibility` requires the article author's token and `{ "isPublished": boolean }` to change visibility.

Passwords must contain at least 8 characters and fit within bcrypt's 72-byte limit. Passwords are hashed before they are written to `mock-data/db.json`. The mock data API requires `MOCK_API_KEY` and listens only on the loopback interface. The frontend keeps the JWT in memory, so refreshing the page signs the user out.

This setup is for local development only. JSON Server and the JSON file are not a production database or a production authentication service.
