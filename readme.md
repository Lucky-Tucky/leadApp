# Lead Tracking App\
Deployed Link - https://lead-app-frontend-9l9t-nu.vercel.app/

A full-stack application built to manage, track, and analyze leads efficiently. The system provides a seamless interface to handle the entire lifecycle of a lead—from initial contact to final conversion status.

## Architecture

The application is structured as a decoupled client-server architecture:

- **Frontend (Client-Side)**: 
  - Built with **React** (Create React App).
  - **React Router** for seamless Single Page Application (SPA) navigation.
  - Custom **Vanilla CSS** for flexible, highly personalized, and responsive styling.
  - API communication is handled via **Axios**.
- **Backend (Server-Side)**: 
  - Built using **Node.js** and **Express.js** providing a robust RESTful API.
  - Configured for Serverless deployment on Vercel.
- **Database**: 
  - **Supabase** (PostgreSQL) is used as the database layer.
  - Interaction with the database is managed through the `@supabase/supabase-js` SDK.
- **Hosting / Infrastructure**: 
  - Both Frontend and Backend are hosted on **Vercel**.
  - `vercel.json` configurations are used in both directories to handle client-side routing rewrites and Express serverless functions, respectively.

---

## Setup Instructions

Follow these steps to run the application locally:

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` folder with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_or_service_key
   PORT=5000
   ```
4. Start the backend server: `npm start` (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `frontend` folder and link it to your local backend:
   ```env
   REACT_APP_BASE_URL=http://localhost:5000/api
   ```
4. Start the React development server: `npm start` (Runs on `http://localhost:3000`)

---

## Deployment Steps

Both the frontend and backend are optimized to be deployed seamlessly on **Vercel**.

### Backend Deployment (Vercel)
1. Import your GitHub repository into Vercel.
2. Set the **Root Directory** to `backend`.
3. Vercel will automatically detect the `vercel.json` configuration to serve the Express app as Serverless Functions.
4. Add the Environment Variables (`SUPABASE_URL`, `SUPABASE_KEY`) in the Vercel project settings.
5. Deploy. Retrieve the generated Vercel production URL.

### Frontend Deployment (Vercel)
1. Import the same GitHub repository into Vercel as a **new project**.
2. Set the **Root Directory** to `frontend`.
3. Vercel will auto-detect the Create React App framework.
4. The included `vercel.json` handles the client-side routing fallback (`/*` -> `/index.html`).
5. Add the Environment Variable `REACT_APP_BASE_URL` and set its value to your newly deployed Backend Vercel URL (e.g., `https://your-backend.vercel.app/api`).
6. Deploy.

---

## Trade-offs

During development, several architectural and technical decisions were made, carrying their respective trade-offs:

- **Create React App (CRA) vs. Vite / Next.js**: 
  - *Trade-off*: CRA was used for its straightforward and familiar structure out of the box. However, it lacks the lightning-fast Hot Module Replacement (HMR) and optimized build times provided by Vite, and the SEO/Server-Side Rendering benefits of Next.js.
- **Express on Vercel (Serverless) vs. Dedicated Server (Render / Heroku)**:
  - *Trade-off*: Deploying Express as serverless functions on Vercel offers zero-maintenance scaling and incredibly easy CI/CD. The downside is the potential for "cold starts" (a slight delay on the first request after a period of inactivity) and lack of WebSocket support for real-time features.
- **Vanilla CSS vs. Utility-First Frameworks (TailwindCSS)**:
  - *Trade-off*: Writing custom CSS keeps the HTML markup clean and gives absolute, granular control over micro-animations and UI glassmorphism. However, as the application scales, maintaining global CSS and preventing style collisions requires strict discipline compared to Tailwind's scoped utility approach.

---

## Future Improvements

To elevate the application to an enterprise-grade level, the following improvements are planned:

1. **Authentication & Authorization**: Implement secure login (via Supabase Auth or JWT) and role-based access control (Admin vs. User) to protect lead data.
2. **Migration to Vite or Next.js**: Transition the frontend build tool to Vite for a significantly faster developer experience, or Next.js for improved SEO and initial load times.
3. **TypeScript Integration**: Incrementally adopt TypeScript across both the frontend and backend to catch runtime errors at compile time and improve code maintainability.
4. **Data Caching & State Management**: Implement React Query (TanStack Query) or Redux Toolkit to cache dashboard API requests, reducing database hits and improving UI responsiveness.
5. **Real-time Updates**: Utilize Supabase's Realtime subscriptions to instantly update the dashboard when other users add or modify leads, eliminating the need to manually refresh.
6. **Automated Testing**: Introduce comprehensive Unit Testing (Jest) and End-to-End Testing (Cypress) to ensure CI/CD reliability before production deployments.
