# Ajo Savings Tracker

Ajo Savings Tracker is a full-stack web application for managing rotating savings groups, contribution cycles, and payout schedules. It helps members create or join savings groups, contribute fixed amounts on a repeat schedule, monitor cycle progress, and track payout rotation in a transparent way.

## Project Overview

This project is designed around the concept of an ajo or contribution group, where members pool money together and rotate payouts according to an agreed order. The application allows users to:

- create savings groups with a contribution amount and frequency,
- invite new members through a group invite code,
- start contribution cycles for active groups,
- record contributions from members,
- confirm payouts when a cycle is complete, and
- view a dashboard with summary metrics and recent activity.

The system uses a React frontend and an Express + MongoDB backend, with authentication and protected routes managed through JWT cookies.

## Key Features

- User registration, login, logout, password reset, and profile updates
- Group creation and joining using invite codes
- Group membership and payout-order tracking
- Contribution cycles with statuses like open, ready for payout, and closed
- Fixed-amount contributions per cycle based on the group's configured contribution amount
- Dashboard summaries for groups, contributions, and payouts
- Contribution history and transaction list
- Leave request workflow for group members
- Dark/light theme support in the frontend
- Password reset emails via Nodemailer

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | UI building and component-based frontend |
| Vite | Fast frontend tooling and local development |
| Tailwind CSS | Styling and layout system |
| React Router DOM | Client-side routing and protected route flow |
| Axios | HTTP client for API communication |
| React Icons | Interface icons |
| Context API | Auth and theme state |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime for the API |
| Express 5 | Web server and route handling |
| MongoDB + Mongoose | Database and data modeling |
| JWT | Authentication tokens |
| bcryptjs | Password hashing and verification |
| cookie-parser | Cookie-based session handling |
| cors | Cross-origin resource sharing |
| Zod | Request validation |
| Nodemailer | Email delivery for password reset |
| dotenv | Environment variable management |

## Project Structure

```text
ajo savings tracker/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── helper/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   └── public/ (static assets folder)
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── ...
│   ├── .env
│   ├── .env.example
│   └── README.md
├── README.md
└── .git/
```

## Authentication and Authorization

Authentication is implemented in the backend with JWTs stored in an HTTP-only cookie named `jwt`.

The key flow is:

- user registers or logs in,
- backend creates a JWT with the user ID and role,
- the token is stored in a cookie,
- `protect` middleware reads the cookie and validates it,
- the authenticated user is attached to `req.user` for protected routes.

The backend also validates request data with Zod schemas before processing requests. Route-level protection is enforced by the `protect` middleware, and the API returns structured error responses for invalid tokens, invalid inputs, and not-found/forbidden cases.

The user model includes:

- `name`
- `email`
- `password` (hashed)
- `avatar`
- `role` (`user` or `admin`)
- `isVerified`
- `passwordResetToken`
- `passwordResetExpires`

> The inspected route code uses JWT-protected access for user, group, cycle, and dashboard endpoints. The active routes in this project use the `protect` middleware, while the `restrict-to` middleware exists in the codebase but is not shown as the active authorization mechanism in the routes inspected.

## Main Application Functionality

### User Account Features

- Register with a full name, email, and password
- Log in and remain authenticated via cookie-based session state
- Log out securely
- View profile information
- Update profile fields such as name, email, and avatar URL
- Change password after verifying the current password
- Recover access through forgot-password and reset-password flows

### Group Management

- Create a savings group with:
  - group name
  - description
  - contribution amount
  - contribution frequency (`daily`, `weekly`, or `monthly`)
  - maximum member count
- Join a group using an invite code
- View a user’s groups and group details
- Delete a group only when the user is the creator and the group is in a valid state
- View active members and current payout-order sequence

### Members and Payout Order

- Group members are stored as a subdocument with a user reference, join date, activity state, payout status, and leave status
- Each group has a `payoutOrder` array that defines the rotation order
- `currentPayoutIndex` tracks the current recipient in the cycle
- Payout order is used to determine who receives the cycle payout next

### Contribution Cycles

- Only the group creator can start a contribution cycle when the group is active
- Each cycle stores:
  - group reference
  - cycle number
  - start date and end date
  - payout recipient
  - total contributed
  - contributor count
  - contribution amount and frequency
  - status (`open`, `ready_for_payout`, `closed`)
- The cycle automatically ends when members complete their required contributions
- Group admins can confirm the payout after a cycle reaches the payout-ready state

### Contributions

- Members contribute a fixed amount matching the group’s configured contribution amount
- Contribution records are unique per cycle per member
- Each contribution is saved with group, cycle, member, amount, and payment date
- Contribution transactions are visible in the user dashboard and contribution history pages

### Leave Requests

- Members can request to leave a group
- Group creators can view and approve pending leave requests
- Approval updates the member state and removes them from active membership and payout order where relevant
- Leave requests are blocked while an active contribution cycle is running

### Dashboard and UI Views

The frontend includes routes for:

- Dashboard overview
- Groups list and group details
- Contribution cycles list and cycle details
- Contribution history
- Current active cycles overview
- Payout rotation order
- User profile management
- Auth screens for login, register, forgot password, and reset password

## API Overview

The backend exposes routes under `/api/v1`.

### Authentication APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Log in with email and password |
| POST | `/api/v1/auth/logout` | Clear the auth cookie |
| POST | `/api/v1/auth/forgot-password` | Send a password reset email |
| POST | `/api/v1/auth/reset-password/:token` | Reset password using a token |
| GET | `/api/v1/auth/me` | Get the current authenticated user |

### User APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/v1/users/me` | Fetch current user profile |
| PATCH | `/api/v1/users/me` | Update profile data |
| PATCH | `/api/v1/users/me/password` | Change password |

### Group APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/groups/create-group` | Create a new group |
| GET | `/api/v1/groups` | List groups for the current user |
| GET | `/api/v1/groups/:groupId` | Get a specific group |
| POST | `/api/v1/groups/join` | Join a group with invite code |
| DELETE | `/api/v1/groups/:groupId/delete` | Delete a group |
| POST | `/api/v1/groups/:groupId/leave-request` | Submit a leave request |
| GET | `/api/v1/groups/:groupId/leave-requests` | View pending leave requests |
| GET | `/api/v1/groups/:groupId/leave-request` | View current user’s leave request |
| PATCH | `/api/v1/groups/leave-requests/:requestId/approve` | Approve a leave request |

### Contribution Cycle APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/groups/:groupId/cycles` | Start a new cycle for a group |
| GET | `/api/v1/groups/:groupId/cycles` | Get cycles for a group |
| GET | `/api/v1/cycles/current` | Get the current active cycle for the logged-in user |
| GET | `/api/v1/cycles/:cycleId` | Get cycle details and contributions |
| POST | `/api/v1/cycles/:cycleId/contributions` | Record a contribution |
| PATCH | `/api/v1/cycles/:cycleId/confirm-payout` | Confirm a payout for a cycle |

### Dashboard and Transaction APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/v1/` | Dashboard metrics, active cycles, recent contributions |
| GET | `/api/v1/transactions` | Fetch transaction history |
| GET | `/api/v1/health` | Health check endpoint |

## Database Overview

The application uses MongoDB via Mongoose. The main data models are:

### User
Stores user account data and authentication state.

### Group
Represents an ajo savings group, including:

- group name and description
- contribution amount and frequency
- maximum members
- creator reference
- member list with status metadata
- payout order
- current payout index
- invite code
- group status

### ContributionCycle
Represents one cycle inside a group, including:

- cycle number
- start and end date
- group reference
- payout recipient
- total contributions
- contributor count
- payout confirmation data
- payout amount
- status

### Contribution
Represents each member’s paid contribution for a cycle.

### Transaction
Records user-level transaction activity, including:

- contribution transactions
- payout transactions
- associated group and cycle data
- amount and description

### LeaveRequest
Tracks a member’s request to leave a group and whether it was approved or rejected.

## Environment Variables

### Backend environment variables

Create a `.env` file in the `backend` directory with variables such as:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@example.com
NODE_ENV=development
```

### Frontend environment variables

The project includes a frontend `.env` file with:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

This value is used by the frontend axios client and should point to the running backend API.

## Frontend Setup and Development

From the `frontend` directory:

```bash
npm install
npm run dev
```

The app runs on the Vite default port `5173`.

The frontend is configured with a `base` path in `vite.config.js` for GitHub Pages deployment:

```js
base: "/Ajo_savings_app/"
```

## Backend Setup and Development

From the `backend` directory:

```bash
npm install
npm run dev
```

The server uses `nodemon` in development mode and starts the Express app from `src/server.js`.

For production, the API can be started with:

```bash
npm start
```

## Running the Full Application Locally

1. Start MongoDB and ensure the backend can connect to `MONGO_URI`.
2. Configure the backend `.env` file with the required environment values.
3. Configure the frontend `.env` file with `VITE_API_URL` pointing to the backend.
4. Start the backend:

```bash
cd backend
npm install
npm run dev
```

5. Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

6. Open the frontend in the browser at:

```text
http://localhost:5173
```

## Production and Deployment

The project contains deployment-related configuration in the codebase:

- the frontend has `gh-pages` in `package.json` and deploy scripts:
  - `predeploy`
  - `deploy`
- the Vite config sets a GitHub Pages base path: `/Ajo_savings_app/`
- the frontend environment file currently points to a Render-hosted API:

```env
VITE_API_URL=https://ajo-savings-app.onrender.com/api/v1
```

This indicates the app is designed for a hosted frontend/backend deployment model, with the frontend able to be published to GitHub Pages and the API served from Render.

## Error Handling and Security Considerations

The application implements several practical safeguards and runtime protections:

- password hashing with `bcryptjs`
- JWT authentication via HTTP-only cookies
- protected middleware on private routes
- request validation with Zod schemas
- centralized global error handling for validation, duplicate keys, invalid object IDs, and JWT issues
- secure cookie settings based on environment (`httpOnly`, `secure`, and `sameSite`)
- password reset tokens hashed before storing and scheduled with expiry
- email-based password reset flow using Nodemailer
- CORS settings that allow credentials and a configurable client origin

## Conclusion

Ajo Savings Tracker is a practical contribution-group management application for coordinating shared savings, rotating payouts, and cycle tracking in a transparent and structured format. It combines a modern React interface with a MongoDB-backed Express API to support real-world group savings workflows in a clean, user-friendly platform.
