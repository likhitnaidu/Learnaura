# Local Development Setup Guide

## Prerequisites
- Node.js 18+ 
- Git
- A code editor (VS Code recommended)

## Step 1: Clone the Repository
```bash
git clone <your-github-repo-url>
cd <your-project-folder>
```

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Environment Configuration
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="cceoeyfaecbxoiwovent"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZW9leWZhZWNieG9pd292ZW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NTg5MTgsImV4cCI6MjA3NDQzNDkxOH0.CUbfpBFSDx0QGIyzdfENxDanUxpgutqsS7vlCI3QBp8"
VITE_SUPABASE_URL="https://cceoeyfaecbxoiwovent.supabase.co"
```

## Step 4: Database Setup
The database is already configured in Supabase. The app will automatically connect to:
- User authentication
- Profiles table
- Assessment questions (JEE/NEET)
- Forum posts and replies
- Student assessments

## Step 5: Start Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:8080`

## Step 6: First Time Setup
1. Open `http://localhost:8080` in your browser
2. Create a new account using the signup form
3. Check your email for verification link
4. After verification, you can sign in and use all features

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Blank Page Issues
- Ensure environment variables are set correctly
- Check browser console for errors
- Verify Supabase connection

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check if user is authenticated
- Ensure RLS policies allow access

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Update dependencies: `npm update`

## Production Deployment

### GitHub Pages
1. Push code to your main branch
2. Enable GitHub Pages in repository settings
3. The GitHub Action will automatically deploy

### Other Hosting Platforms
- **Vercel**: Connect your GitHub repo
- **Netlify**: Connect your GitHub repo  
- **Firebase Hosting**: `npm run build` then `firebase deploy`

## Database Access
- Supabase Dashboard: https://supabase.com/dashboard/project/cceoeyfaecbxoiwovent
- Direct database access available through the dashboard
- All tables have Row Level Security (RLS) enabled for data protection