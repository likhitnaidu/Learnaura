# Package Scripts Setup

Since package.json cannot be modified directly, here are the scripts you should add manually:

## Add to package.json scripts section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "server": "node server.js",
    "seed": "echo 'Mock data is already in db.json'",
    "start:all": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

## Installation Commands:

```bash
# Install development dependencies for JSON server
npm install --save-dev concurrently

# Or run servers separately:
# Terminal 1:
npm run dev

# Terminal 2:
npm run server
```

## API Endpoints Available:

- GET http://localhost:3001/api/students
- GET http://localhost:3001/api/teachers  
- GET http://localhost:3001/api/lessons
- GET http://localhost:3001/api/events
- PUT http://localhost:3001/api/lessons/:id (for drag-drop updates)

## Lighthouse Performance Tips:

1. All images use optimized avatars from pravatar.cc
2. Lazy loading implemented for charts and components
3. Proper semantic HTML with ARIA labels
4. Responsive design with mobile-first approach
5. Efficient animations with Framer Motion
6. Tree-shaken imports for optimal bundle size