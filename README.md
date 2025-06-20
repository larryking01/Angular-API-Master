# PostCraft

PostCraft is a single-page Angular application that allows users to view, create, edit, and delete posts. It simulates an authenticated user experience, implements pagination, caching, error handling, and uses a reactive architecture throughout.

# Features

* CRUD operations on posts

* Pagination with page count auto-detection

* Reactive Forms with validation and error messages

* Global toast notifications for success/errors

* Centralized error handling

* In-memory caching of GET requests

* Authentication simulation with route protection

* HTTP Interceptor to log requests and attach mock tokens

* Reusable UI components (pagination, toast, modals)

* Responsive design with modern styling


# Project Structure
src/
├── app/
│   ├── components/          → Feature components (posts, modals, navbar, etc.)
│   ├── services/            → Shared services (API, Auth, Error, Cache, Toast, etc.)
│   ├── shared/              → Shared interfaces/models
│   ├── environments/        → Environment configs (dev/staging/prod)
│   ├── app.routes.ts        → Route config with guards
│   ├── app.config.ts        → Angular app configuration
│   └── main.ts              → App bootstrap   



# Setup Instructions

1. Clone the repository


2. Install dependencies 
   npm install


3. Run the app in development
   ng serve



# Available NPM Scripts

Script

* start - Start the dev server using ng serve

* build - Build the app for production

* watch - Build and watch for file changes

* test - Run unit tests via Karma



# Environments

You can configure API endpoints and other constants per environment inside:

* src/environments/environment.ts (development)

* src/environments/environment.prod.ts (production)

* src/environments/environment.staging.ts (optional)

* Switch between them during build:
 for example, ng build --configuration=production 


# Auth Simulation

* The app uses a mock login system via AuthService.

* A mock token is stored in localStorage.

* Certain routes (like create-post, edit-post and post-details) are protected by AuthGuard.

* All outgoing HTTP requests include the token via AuthInterceptor.