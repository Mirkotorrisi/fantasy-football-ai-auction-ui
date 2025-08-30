# Fantacalcio AI UI

Modern Next.js application for managing Fantacalcio (fantasy football) with AI‑powered features.

## Tech Stack

- Next.js (App Router) – routing, SSR/SSG (`app/layout.tsx`, `app/page.tsx`)
- React / TypeScript
- Tailwind CSS (utility styling, configured via `app/globals.css`)
- shadcn/ui (design system primitives; config in `components.json`)
- PostCSS + Autoprefixer
- (Planned) Context, hooks, services, lib utilities

## Project Structure

```
.
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ControlPanel.tsx
│   ├── Header.tsx
│   └── MicButton.tsx
├── context/
├── hooks/
├── lib/
├── pages/
│   ├── HomePage.tsx
│   └── LoginPage.tsx
├── services/
│   └── api.ts
├── types/
```

### Key Files

| File               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `app/layout.tsx`   | Global HTML shell, metadata, fonts, theming |
| `app/page.tsx`     | Home page / initial dashboard               |
| `app/globals.css`  | Global Tailwind layers & custom styles      |
| `components/*.tsx` | Reusable UI components                      |
| `components.json`  | shadcn/ui generator configuration           |

## shadcn/ui Integration

Configured with:

- Style: `new-york`
- `rsc: true`
- CSS variables enabled
- Aliases:
  - `@/components`
  - `@/components/ui`
  - `@/lib`
  - `@/hooks`
  - `@/lib/utils`

Import example:

```ts
import { Button } from "@/components/ui/button";
```

Add a new primitive:

```bash
npx shadcn-ui@latest add button
```

## Tailwind CSS

- Global styles in `app/globals.css`
- PostCSS pipeline via `postcss.config.mjs`
- Utility merge pattern (e.g. helper in `@/lib/utils`)

## Scripts (package.json)

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Run production build
npm run lint      # Lint source
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open:
   ```
   http://localhost:3000
   ```

## Architecture Overview

- Presentation: Components + shadcn/ui primitives
- State / Context (planned): `context/` (auth, user session, theme)
- Hooks: Reusable logic (`hooks/`)
- Services: API / data fetching abstraction (`services/`)
- Lib: Utilities (`lib/`)
- Types: Interfaces / domain models (`types/`)

## Styling & Theming

- Tailwind utility-first classes

## Conventions

- Absolute imports via path aliases (`tsconfig.json`, `components.json`)
- Co-locate feature-specific helpers as project grows

## Deployment

```bash
npm run build
npm run start
```

Targets:

- Vercel (recommended)
- Any Node host / container (serve `.next` output)

## Testing (Planned)

Suggested:

- Vitest or Jest
- React Testing Library
- Add script: `npm run test`

## Future Enhancements

- Authentication & session
- Auction / squad management
- AI chat & lineup optimization
- API integration layer
- Accessibility audit
- Test coverage

## Contribution

1. Branch: `feat/<name>`
2. Follow linting & TypeScript guidelines
3. PR with concise description

---

Extend with domain workflows (data ingestion, AI prompt patterns)
