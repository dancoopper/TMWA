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

- **Feature-Based Organization**: Domain logic (e.g., `auth`) is encapsulated within `features/` for modularity.
- **Repository Pattern**: API calls are abstracted in `repositories/` to separate data fetching from the UI.
- **Global State**: Managed via Zustand stores in the `stores/` directory.
- **Route Guards**: Navigation logic is handled by `ProtectedRoute` and `PublicRoute` components.
- **Path Aliases**: Uses `@/` to reference the `src/` directory for cleaner imports.

## Development Documentation

Refer to the following [tldraw canvas](https://www.tldraw.com/f/2PeBOC2jJTkzWcgc5vShK?d=v-5000.-1002.9180.6313.page) for project plans and specifications.
