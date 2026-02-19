# 🔖 Smart Bookmark Application

A full-stack bookmark manager with **Google OAuth authentication**, **real-time synchronization**, **visit tracking**, and a modern, responsive UI.

## 🎯 Features

✨ **User Authentication** - Secure Google OAuth login via Supabase  
✨ **Bookmark Management** - Create, read, update, and delete bookmarks  
✨ **Visit Tracking** - Monitor and display bookmark visit counts  
✨ **Real-Time Sync** - Automatic updates across multiple browser tabs  
✨ **Smart Sorting** - View by Latest (default 5), Most Visited, or All  
✨ **Responsive Design** - Mobile-friendly interface with Tailwind CSS  
✨ **Custom UI Components** - Toast notifications and confirmation modals  

## 📚 Documentation

**For complete project documentation, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)**

This includes:
- Complete architecture overview
- Technology stack details
- Database schema and RLS policies
- Frontend and backend implementation details
- Real-time synchronization mechanism
- Styling and UI component guide
- Installation and setup instructions
- API endpoint documentation
- Environment configuration
- Development workflow best practices
- Testing checklist
- Troubleshooting guide

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase Client** - Real-time DB & Auth

### Backend
- **Express.js** - REST API framework
- **Node.js** - JavaScript runtime
- **Supabase** - PostgreSQL & Authentication

### Database & Services
- **Supabase PostgreSQL** - Cloud database with RLS
- **Supabase Auth** - Google OAuth provider
- **Supabase Realtime** - Real-time subscriptions

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm
Supabase account
```

### 1. Install Dependencies

```bash
npm install          # Root dependencies
cd frontend && npm install  # Frontend
cd ../backend && npm install # Backend
```

### 2. Environment Setup

**frontend/.env.local**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**backend/.env**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=4000
```

### 3. Supabase Configuration

**Create bookmarks table:**
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  visit_count INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Add RLS policies (see full documentation)
```

**Enable Google OAuth & Realtime:**
- Supabase Dashboard → Authentication → Providers → Google
- Supabase Dashboard → Database → Realtime → Enable for bookmarks table

### 4. Run Application

```bash
# From root directory
npm run dev

# Or run separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:3001

## 📁 Project Structure

```
/Users/shahbath/Task/
├── README.md                    # This file
├── PROJECT_DOCUMENTATION.md     # Complete documentation ⭐
├── package.json                 # Root package (concurrently)
│
├── frontend/                    # Next.js Application (Port 3001)
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/page.tsx       # Main bookmark dashboard
│   │   │   ├── login/page.tsx           # Google OAuth login
│   │   │   └── globals.css              # Global styles
│   │   ├── components/
│   │   │   ├── bookmarks/
│   │   │   │   ├── BookmarkForm.tsx     # Add bookmark form
│   │   │   │   └── BookmarkList.tsx     # Display bookmarks
│   │   │   └── ui/
│   │   │       ├── Notification.tsx     # Toast alerts
│   │   │       ├── ConfirmModal.tsx     # Delete confirmation
│   │   │       └── ...other components
│   │   ├── features/
│   │   │   └── bookmarks/bookmarksSlice.ts  # Redux store
│   │   ├── lib/
│   │   │   └── supabaseClient.ts        # Supabase setup
│   │   └── store/
│   │       ├── index.ts                 # Redux store config
│   │       └── hooks.ts                 # Custom hooks
│   └── ...config files
│
└── backend/                     # Express API (Port 4000)
    ├── src/
    │   ├── app.js               # Express setup
    │   ├── server.js            # Server entry point
    │   ├── config/
    │   │   └── supabaseClient.js # Supabase client
    │   ├── middleware/
    │   │   └── auth.js          # JWT authentication
    │   └── features/
    │       └── bookmarks/
    │           ├── bookmarks.routes.js
    │           ├── bookmarks.controller.js
    │           └── bookmarks.service.js
    └── ...config files
```

## 📡 API Endpoints

All endpoints require `Authorization: Bearer <jwt_token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | Fetch all bookmarks |
| POST | `/api/bookmarks` | Create bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |
| POST | `/api/bookmarks/:id/visit` | Track visit (increment count) |

## 🔄 Key Features in Detail

### Real-Time Synchronization
Combines three sync methods for reliability:
- **Supabase Real-Time Listeners** - Instant updates (milliseconds)
- **5-Second Polling** - Fallback if listeners fail
- **Window Focus Listeners** - Refetch on tab switch

### Visit Tracking
- Increments when users click bookmark links
- Displays visitor count on each bookmark
- Persists to database
- Sorted by most visited on demand

### Responsive UI
- **Notification Component** - Auto-dismissing toast alerts (3s)
- **ConfirmModal Component** - Screen-centered delete confirmation
- **Mobile-Friendly** - Responsive layout with Tailwind CSS
- **Animations** - Smooth fade-in and slide transitions

## ⚙️ Development Scripts

```bash
# Root directory
npm run dev              # Run frontend + backend concurrently
npm run install-all      # Install all dependencies

# Frontend directory
npm run dev              # Start Next.js dev server (port 3001)
npm run build            # Build for production
npm run lint             # Run ESLint

# Backend directory
npm run dev              # Start Express with nodemon (port 4000)
npm start                # Start without nodemon
```

## 🔐 Security

- **Row Level Security (RLS)** - Users access only their own bookmarks
- **JWT Authentication** - Secure token-based API access
- **Google OAuth** - No password storage
- **Environment Variables** - Sensitive data not in code

## 🧪 Testing

1. **Add Bookmark** - Should show success notification
2. **Delete Bookmark** - Should show centered confirmation modal
3. **Real-Time Sync** - Open 2 tabs, add bookmark in one, other updates within 5 seconds
4. **Visit Tracking** - Click bookmark, return to dashboard, visit count increases
5. **Sorting** - Toggle between Latest 5, Most Visited, All

## 🐛 Troubleshooting

**Visit count not incrementing?**
- Ensure database migration applied: `ALTER TABLE bookmarks ADD COLUMN visit_count INTEGER NOT NULL DEFAULT 0;`

**Real-time sync not working?**
- Enable Realtime in Supabase: Dashboard → Database → Realtime → Toggle for bookmarks

**Bookmarks not loading?**
- Verify backend running on port 4000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Look for CORS errors in browser console

## 📖 Complete Documentation

See [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for:
- Complete architecture diagrams
- Detailed component documentation
- Database schema and RLS policies
- Frontend and backend implementation guides
- Real-time synchronization details
- Styling and UI component specifications
- Installation troubleshooting
- Development best practices
- Testing checklist

## 📝 Notes

- Backend expects JWT token in `Authorization: Bearer <token>` header
- Frontend automatically manages tokens via Supabase session
- All bookmarks are user-scoped via RLS policies
- Real-time updates work across tabs, devices, and browser windows

## 🎉 Status

✅ Features Complete  
✅ Real-Time Sync Working  
✅ Visit Tracking Implemented  
✅ Custom UI Components  
⚠️ Database migration required (run SQL above before visit tracking works)
