# Backend

Express API server.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The server loads `backend/.env` on startup. `.env.example` provides `PORT=3000` and `NODE_ENV=development`; `PORT` defaults to `3000` if it is omitted. Keep secrets in `.env`, which is ignored by Git. `GET /health` returns `{ "status": "ok" }`.
