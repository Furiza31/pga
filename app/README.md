# PGA

A Vue 3 application with TypeScript and Tailwind CSS.

## Features

- Authentication system with login and registration
- User profile management
- Event management
- Project management
- Forum system

## Technologies

- Vue 3
- TypeScript
- Vue Router
- Pinia for state management
- Tailwind CSS for styling
- Vite for development and building

## Project Setup

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Architecture

The application follows a modular architecture:

- `/src/components`: Reusable Vue components
- `/src/views`: Page components
- `/src/layouts`: Layout components that wrap pages
- `/src/stores`: Pinia stores for state management
- `/src/router`: Vue Router configuration
- `/src/lib`: Utilities and services like API client
- `/src/types`: TypeScript type definitions

## Authentication Flow

The authentication flow is implemented using JWT tokens:

1. User registers or logs in
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is included in API requests
5. Server validates token for protected endpoints
