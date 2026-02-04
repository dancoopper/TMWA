# Time Management Web App

## Setup

Install Dependencies

```bash
npm install
```

Running the App

```bash
npm run dev
```

## Project Structure

```text
src/
├── assets/             # Static assets (images, svgs, etc.)
├── components/
│   └── ui/             # Reusable, atomic UI components (Shadcn/UI)
├── features/
│   └── auth/           # Domain-specific logic, components, and hooks
│       ├── components/ # Feature-specific components (LoginForm, SignupForm)
│       └── hooks/      # Custom React hooks for this feature (useSignup)
├── lib/                # Shared utilities and third-party client configs
│   ├── supabase.ts     # Supabase client initialization
│   └── utils.ts        # Tailwind merge and class utility
├── pages/              # Routed page components (Views)
├── repositories/       # Data access layer (API calls and data mapping)
├── routes/             # Routing logic and route guards (Protected/Public)
├── stores/             # Global state management (Zustand)
├── App.tsx             # Main App component (Providers & Router config)
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind 4 configuration
```

### Architectural Patterns

- **Feature-Based Organization**: Domain logic (e.g., `auth`) is encapsulated
  within `features/` for modularity.
- **Repository Pattern**: API calls are abstracted in `repositories/` to
  separate data fetching from the UI.
- **Global State**: Managed via Zustand stores in the `stores/` directory.
- **Route Guards**: Navigation logic is handled by `ProtectedRoute` and
  `PublicRoute` components.
- **Path Aliases**: Uses `@/` to reference the `src/` directory for cleaner
  imports.

## Development Documentation

Refer to the following
[tldraw canvas](https://www.tldraw.com/f/2PeBOC2jJTkzWcgc5vShK?d=v-5000.-1002.9180.6313.page)
for project plans and specifications.

# Local Supabase Setup

## Start the local development environment

To start the local Supabase stack:

```bash
supabase start
```

This will spin up all the necessary Supabase services (Database, Auth, Storage,
etc.) locally using Docker.

## Setup .env.local

After running `supabase start`, you will see output containing your local **API
URL** and **Anon Key**. Create a `.env.local` file in the project root if it
doesn't already exist, and add these values:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

## Email Verification Testing (Mailpit)

The local Supabase setup includes an email testing server (Mailpit) that
captures all emails sent by the auth system (e.g., confirmation links, password
resets).

You can access the web interface to view these emails at:

[http://127.0.0.1:54324](http://127.0.0.1:54324)

This is useful for clicking email verification links during local development
without sending real emails.
