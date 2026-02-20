# Campus Placement Management System - Frontend

This is the frontend for the Campus Placement Management System, built with React, Vite, and Tailwind CSS. It provides a comprehensive interface for students, recruiters, and administrators to manage the placement process.

## Features

- **User Roles Check:**
  - **Student:** Profile management, Job application, Mock interviews, Resume builder.
  - **Recruiter:** Job posting, Candidate shortlisting, Interview scheduling.
  - **Admin/TPO:** User verification, Analytics, System management.
- **Advanced Authentication:**
  - **Google OAuth:** Secure sign-up and login.
  - **Face ID:** Biometric login and registration using `face-api.js`.
- **Modern UI:**
  - Responsive design with Tailwind CSS.
  - Glassmorphism effects and animations.
  - Dark/Light mode capable architecture.
- **Performance:**
  - Code splitting with `React.lazy`.
  - Optimized assets.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **State Management:** React Context API
- **Deployment:** Vercel (Recommended)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Campus-Placement-Management-System-Front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

## Build & Deployment

### Production Build

To create a production-ready build:

```bash
npm run build
```
This will generate a `dist` folder containing the compiled assets.

### Preview Build

To preview the production build locally:

```bash
npm run preview
```

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts to deploy.

## Troubleshooting

- **Google Login Error:**
  - Ensure `VITE_GOOGLE_CLIENT_ID` is correct in `.env`.
  - Add `http://localhost:5173` to "Authorized JavaScript origins" in Google Cloud Console.
- **Face ID Issues:**
  - Ensure webcam permission is granted.
  - Face API models are loaded from `https://justadudewhohacks.github.io/face-api.js/models`. Ensure internet access.

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
├── context/        # React Context (Auth, Socket)
├── pages/          # Page components (Routes)
├── services/       # API service (Axios config)
├── App.jsx         # Main App component with Routes
└── main.jsx        # Entry point
```
