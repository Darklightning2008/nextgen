# Sigil — certificate security demo

The original standalone dashboard has been carried into a Vite + React + TypeScript single-page project, with an optional Flask API for a clean Vercel + Render deployment. The verifier currently uses four hardcoded sample records. Its verdicts and risk scores are illustrative, not real certificate-security decisions.

## Local development

Requirements: Node.js 20+ and Python 3.11+.

### Frontend

```bash
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs at `http://localhost:5173`. Leave `VITE_API_BASE_URL` empty to use the local sample demo.

### Optional Flask API

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Set `VITE_API_BASE_URL=http://localhost:5000` in the frontend `.env.local`, then restart Vite. The API currently exposes `/api/health`, `/api/certificates`, and `/api/verify` and returns the same illustrative sample fixtures.

## Deploy the frontend to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Add `VITE_API_BASE_URL` with the public Render service URL, for example `https://sigil-api.onrender.com`.
5. Redeploy after setting the environment variable.

`vercel.json` includes an SPA rewrite so direct section/hash routes resolve to `index.html`.

## Deploy the API to Render

1. Push the project to GitHub and create a new **Blueprint** in Render using this repository.
2. Render reads `render.yaml`; the service root is `backend`, build command installs `requirements.txt`, and start command is `gunicorn app:app`.
3. Set `CORS_ORIGINS` to the exact Vercel production origin, e.g. `https://your-project.vercel.app`. For preview deployments, add their origins as comma-separated values if needed.
4. Wait for `/api/health` to return `{"status":"ok", ...}`.
5. Copy the Render service URL into Vercel's `VITE_API_BASE_URL` and redeploy the frontend.

## Important before production use

- The API is a deployment scaffold and deterministic demo endpoint. It does not parse uploaded certificates, verify a certificate chain, check revocation, run a forgery model, or perform QUBO optimization.
- Do not label these sample outputs as real validation. Implement and test the cryptographic verification pipeline server-side before accepting real documents or making trust decisions.
- Add authentication and authorization before enabling administrative actions such as approve, flag, or revoke. Those controls are currently presentation-only.
- Configure a real persistence layer, audit retention, rate limiting, monitoring, and secret management before production use.
