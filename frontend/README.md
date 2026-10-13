# Frontend

React + Vite client for the codex-app authentication flow.

```bash
cd frontend
npm install
npm run dev
```

The development server runs at `http://localhost:5173` and proxies `/api` requests to the Express backend at `http://127.0.0.1:3000`. Start the backend and its JSON Server data store using the instructions in `backend/README.md`.

The public landing page is at `/`; the authentication screens use `/login` and `/register`. `/dashboard` is protected by the auth context. Blog posts at `/posts` are publicly readable; signed-in users can publish articles and choose whether each one is public or private. Requests go through the shared Axios client in `src/lib/apiClient.js`.
