# Ajo Savings Tracker — Frontend

React + Vite frontend for the Ajo Savings Tracker backend.

## Stack

- React + Vite
- Tailwind CSS v4
- React Router DOM (`createBrowserRouter`)
- Axios (with credentials for JWT cookies)
- React Icons
- React Context (auth + theme)

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server (runs on port 5173):

```bash
npm run dev
```

Ensure the backend is running on `http://localhost:5000` with CORS configured for `http://localhost:5173`.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:5000/api/v1`) |

## Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Request password reset email |
| `/reset-password/:token` | Reset password via email link |
| `/dashboard` | Overview stats and activity |
| `/groups` | List, create, and join groups |
| `/groups/:groupId` | Group details, members, actions |
| `/groups/:groupId/cycles` | Cycle history for a group |
| `/groups/:groupId/cycles/:cycleId` | Cycle details and contributions |
| `/contributions` | Your contribution transactions |
| `/cycles` | Active cycles across groups |
| `/payout-order` | Payout rotation per group |
| `/profile` | Profile and password settings |

## Build

```bash
npm run build
npm run preview
```
