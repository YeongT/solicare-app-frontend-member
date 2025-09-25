# SoliCare Frontend Member Application

This is the frontend application for SoliCare members, built with React, TypeScript, and Firebase Cloud Messaging for real-time notifications.

## Project Overview

SoliCare is a health monitoring platform that allows members to track and manage the health status of seniors. This frontend application provides the member interface with features including:

- User authentication (login/signup)
- Dashboard with senior profiles
- Health metrics monitoring
- Real-time alerts via Firebase Cloud Messaging
- Senior management functionality

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: CSS with component-based architecture
- **State Management**: React Context API
- **API Communication**: Axios
- **Charts/Visualization**: Recharts
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Development Tools**: ESLint, Prettier
- **Mock API**: JSON Server

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- Yarn package manager
- Firebase project with Cloud Messaging enabled

## Environment Setup

Create a `.env` file in the root directory with the following Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `yarn build`

Builds the app for production to the `build` folder, including the Firebase messaging service worker.

### `yarn build:sw`

Builds only the Firebase messaging service worker using esbuild.

### `yarn test`

Launches the test runner in interactive watch mode.

### `yarn mock-server`

Starts a mock API server using JSON Server at http://localhost:3001.

### `yarn format`

Formats code using Prettier.

### `yarn lint`

Runs ESLint to check for code quality issues.

### `yarn serve`

Serves the production build locally to test the built application.

## Firebase Cloud Messaging Integration

This application integrates Firebase Cloud Messaging (FCM) for real-time notifications:

1. **Service Worker**: Handles background notifications when the app is not active
2. **Foreground Notifications**: Managed via the app's notification system when active
3. **Token Registration**: Automatically registers FCM tokens with the backend

The service worker is built using esbuild and is automatically included in the build process.

## Project Structure

```
src/
  ├── api/            # API client and endpoint handlers
  ├── apiMock/        # Mock data for development
  ├── components/     # Reusable UI components
  ├── contexts/       # React context providers (Auth)
  ├── pages/          # Page components
  ├── styles/         # Global and page-specific styles
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions and helpers
  ├── App.tsx         # Main application component
  ├── index.tsx       # Application entry point
  └── firebase-messaging-sw.ts  # Firebase messaging service worker
```

## Contributing

1. Follow the code style guidelines (enforced by ESLint and Prettier)
2. Write unit tests for new functionality
3. Make sure all tests pass before submitting pull requests

## Troubleshooting

### Firebase Integration

If you encounter issues with Firebase integration:
- Ensure your Firebase configuration is correct in `.env`
- Check that the Firebase service worker is building correctly
- Verify that your Firebase project has Cloud Messaging enabled

### TypeScript Errors

For TypeScript errors related to Firebase:
- The project includes custom type definitions in `src/types/firebase.d.ts`
- Ensure you're using Firebase v9.22.0 as specified in the dependencies
