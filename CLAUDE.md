# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DanceCrew (KSS) is a full-stack application for crawling and analyzing stock-related comments from Korean financial platforms. The project uses Django 5.2.7 for the backend API and React 19 with TypeScript for the frontend.

## Development Commands

### Backend (Django)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirement.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Make migrations
python manage.py makemigrations

# Access Django shell
python manage.py shell
```

### Frontend (React + Vite)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Backend Architecture

The backend is a Django application focused on crawling stock comments asynchronously:

**Apps:**
- `kss/` - Main Django project configuration
- `crawling/` - Core app handling comment collection and storage

**Models:**
- `Stock` (stock_models.py) - Master stock data with stock_code, stock_name, stock_type, stock_category
- `Comments` (comments_models.py) - Crawled comments with site, comment_id, message, stock_code, created_at

**Important:** Models currently use string-based references rather than ForeignKey relationships. The `Comments.stock_code` field references `Stock.stock_code` as a string, not a proper Django ForeignKey.

**API Endpoints:**
- `GET/POST /comments/toss/<subject_id>/` - Triggers comment crawling from Toss Invest platform

**Crawler Implementation:**
- Main crawler: `toss_comments_crawler_view` (crawling/views/toss_comments_crawler_view.py)
- Uses async/await with aiohttp for concurrent HTTP requests
- Semaphore-based rate limiting (max 5 concurrent requests)
- Automatic retry logic (3 retries max)
- Duplicate detection via last comment ID checking

**Database:**
- MySQL (recently migrated from MariaDB)
- Database credentials managed via django-environ in `.env` file
- Required env vars: `DB_USER`, `DB_USER_PW`, `DB_HOST`, `DB_PORT`, `DJANGO_SECRET_KEY`
- PyMySQL driver (installed as MySQLdb in manage.py)

### Frontend Architecture

The frontend is a modern React application currently in early development:

**Tech Stack:**
- React 19.1.1 with TypeScript ~5.9.3
- Vite 7.1.14 (using rolldown-vite, experimental Rust-based bundler)
- Tailwind CSS 4.1.14 for styling
- React Router DOM 7.9.4 (installed but not yet implemented)
- React Compiler enabled for performance optimization

**Current Structure:**
- Entry: `src/main.tsx` renders `App.tsx` into `#root`
- Minimal routing - prepared but not yet implemented
- No global state management - uses local useState only
- Tailwind CSS with PostCSS pipeline configured

**Important:** The `feature/front-mainpage` branch is setting up the foundational structure. Expect routing and component organization to be added incrementally.

## Database Configuration

**Required .env file** (backend directory):
```
DJANGO_SECRET_KEY=your-secret-key
DB_USER=your-db-user
DB_USER_PW=your-db-password
DB_HOST=localhost
DB_PORT=3306
TOSS_INVEST_COMMENTS_API_BASE_URL=https://...
```

Database tables use `utf8mb4` charset for Korean character support.

## Key File Locations

### Backend
- Settings: `backend/kss/settings.py`
- URL routing: `backend/kss/urls.py` (root) and `backend/crawling/urls.py` (app)
- Models: `backend/crawling/models/`
- Views: `backend/crawling/views/`
- Migrations: `backend/crawling/migrations/`

### Frontend
- Entry point: `frontend/src/main.tsx`
- App component: `frontend/src/App.tsx`
- Config: `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/tailwind.config.js`
- Styles: `frontend/src/index.css` (global + Tailwind), `frontend/src/App.css`

## Development Notes

### Backend

**Async Operations:**
The crawler uses Python's async/await extensively. When modifying crawler code:
- Ensure async functions are properly awaited
- Respect semaphore limits to avoid overwhelming external APIs
- Use the logging module for debugging (already configured)

**Model Relationships:**
Current architecture uses string references instead of ForeignKeys. If adding new models that reference Stock or Comments, maintain this pattern or migrate all relationships to proper ForeignKeys with a migration.

**Admin Interface:**
Django admin is enabled but models are not registered. To use admin, register models in `crawling/admin.py`.

### Frontend

**TypeScript Configuration:**
Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`. Remove unused imports and variables or disable checks if needed.

**Styling:**
Tailwind CSS 4.x is configured. Use utility classes in JSX. The preflight (CSS reset) is imported in `index.css`.

**Build Tool:**
Using rolldown-vite (experimental Rust bundler) instead of standard Vite. This is defined in package.json overrides. If encountering build issues, consider switching back to standard Vite.

## Common Workflows

### Adding a New Crawler Source

1. Create view class in `backend/crawling/views/` following `toss_comments_crawler_view.py` pattern
2. Add URL pattern in `backend/crawling/urls.py`
3. Ensure duplicate detection via comment_id checking
4. Use semaphore limiting for rate control
5. Test with small subject_id first

### Adding a New Frontend Page

1. Create component in `frontend/src/` (consider creating `pages/` directory)
2. Set up routing in App.tsx using React Router DOM
3. Use Tailwind utility classes for styling
4. Follow TypeScript strict mode requirements

### Database Schema Changes

1. Modify models in `backend/crawling/models/`
2. Run `python manage.py makemigrations`
3. Review generated migration in `migrations/`
4. Run `python manage.py migrate`
5. Update .env if new configuration needed

## Current Branch

Branch: `feature/front-mainpage`
Main branch: `main`

Recent work focused on migrating database from MariaDB to MySQL and setting up frontend foundation with React 19 and Tailwind CSS.
