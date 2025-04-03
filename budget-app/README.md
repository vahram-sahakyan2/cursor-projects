# Budget App

A modern web application for personal budgeting and expense tracking.

## Project Structure

```
budget-app/
├── frontend/          # React frontend application
└── backend/           # Node.js/Express backend application
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3001
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Features

- Modern, responsive UI built with React and Material-UI
- TypeScript for better type safety and developer experience
- RESTful API backend with Express
- Real-time updates and data persistence

## Development

- Frontend is built with Create React App and TypeScript
- Backend uses Express with TypeScript
- Material-UI for styling and components
- React Router for navigation
- Axios for API calls

## License

ISC 