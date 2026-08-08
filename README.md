# Traders of Africa Marketplace

[Traders of Africa (TOFA)](https://tradersofafrica.com) is a multilingual digital marketplace connecting African suppliers with local and global buyers. The frontend is built with Next.js App Router, TypeScript, Tailwind CSS, `next-intl`, and an Atomic Design component architecture.

## Current Features

- Responsive marketplace homepage with product grids, category navigation, promotional sliders, and Framer Motion reveals.
- Locale-aware routing and content in English, French, Spanish, Swahili, and Portuguese.
- Localized Our Story, What We Do, Our Impact, Become Seller, and 404 pages.
- Responsive mobile navigation drawer with backdrop, scroll locking, and keyboard dismissal.
- Become Seller landing page with supplier benefits, onboarding steps, pricing plans, policy downloads, and an inline YouTube tutorial player.
- Downloadable starter Supplier Compliance and Product Exclusions PDF documents.
- Custom localized 404 handling for unmatched and nested routes.
- Reusable UI organized with atoms, molecules, organisms, and templates.
- Responsive images through the Next.js Image component.
- Reduced-motion accessibility support for animated content.

## Supported Languages

| Locale | Language |
| --- | --- |
| `en` | English |
| `fr` | French |
| `es` | Spanish |
| `sw` | Swahili |
| `pt` | Portuguese |

Localized URLs use a locale prefix, for example `/en/our-story` and `/fr/become-seller`.

## Public Routes

- `/[locale]` — Marketplace homepage
- `/[locale]/our-story` — Company story, mission, vision, and team
- `/[locale]/what-we-do` — Marketplace services and technology
- `/[locale]/our-impact` — Customer impact stories
- `/[locale]/become-seller` — Supplier onboarding and subscription plans
- Any unmatched localized URL — Custom 404 page

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- next-intl
- Framer Motion
- TanStack Query
- Axios
- Lucide React
- shadcn/ui

## Project Structure

```text
src/
├── app/
│   ├── [locale]/               # Localized routes and layout
│   ├── globals.css
│   └── page.tsx                # Redirects to the default locale
├── components/
│   ├── atoms/                  # Small reusable UI primitives
│   ├── molecules/              # Composed UI elements
│   ├── organisms/              # Page sections
│   └── templates/              # Shared page layouts
├── features/                   # Feature-specific types and constants
├── i18n/                       # Locale request and routing configuration
├── lib/                        # Hooks, helpers, constants, and utilities
└── proxy.ts                    # Locale detection and routing proxy

messages/                       # Translation files by locale
public/
├── assets/                     # Images, icons, and static media
└── documents/                  # Downloadable policy PDFs and source drafts
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone <repository-url>
cd marketplace-v3-fe
npm install
```

### Development

```bash
npm run dev
```

The default development server is available at [http://localhost:3000](http://localhost:3000). A custom port can be supplied with:

```bash
npm run dev -- -p 3004
```

### Validation

```bash
npm run lint
npm run build
```

## Localization

Locale definitions live in `src/i18n/routing.ts`, while translations live in `messages/<locale>.json`. When adding visible interface copy:

1. Add the same key to every supported locale file.
2. Use `useTranslations` rather than hard-coded interface text.
3. Preserve the active locale in internal navigation.
4. Run the lint and production build checks before committing.

## Seller Policy Documents

Editable starter drafts and generated PDFs are stored in `public/documents`:

- `supplier-compliance.txt` and `supplier-compliance.pdf`
- `product-exclusions.txt` and `product-exclusions.pdf`

The drafts are starting points and should receive legal review before production use.

## Architecture Notes

- Page sections should be composed from reusable Atomic Design components.
- Server Components are preferred unless browser state, event handlers, or animation hooks require a Client Component.
- Motion components respect the user's reduced-motion preference.
- The project uses the Next.js 16 `proxy.ts` convention for locale routing.

## License

This project is proprietary and owned by Traders of Africa.
