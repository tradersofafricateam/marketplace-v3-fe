# Traders of Africa Marketplace

[Traders of Africa (TOFA)](https://tradersofafrica.com) is a multilingual B2B and B2C marketplace frontend for connecting African suppliers with local and global businesses and buyers. It is built with the Next.js App Router, TypeScript, Tailwind CSS, `next-intl`, and an Atomic Design component architecture.

> **Project status:** The current application is a frontend prototype. Product and category data, catalogue ratings, availability, and currency conversion rates are local demo data. Authentication (sign up, email OTP verification, login, Google sign-in, password reset) is wired to the backend API contract; commerce flows such as cart, checkout, and the buyer/seller dashboard are not connected yet.

## Features

- Responsive marketplace homepage with category navigation, product collections, promotional sliders, video guides, and motion-enhanced sections.
- Locale-aware routes and interface copy in English, French, Spanish, Swahili, and Portuguese.
- Searchable product catalogue with URL-backed filters for category, price, rating, verification, stock status, and minimum order quantity.
- Catalogue sorting, grid/list views, collection links, and a responsive mobile filter drawer.
- Currency selection for NGN, USD, EUR, GBP, KES, GHS, and XOF, persisted in browser storage.
- Localized Our Story, What We Do, Our Impact, Become Seller, catalogue, and 404 pages.
- Responsive mobile navigation with a backdrop, scroll locking, and keyboard dismissal.
- Seller landing page with benefits, onboarding steps, pricing plans, policy downloads, and an inline YouTube tutorial.
- Reusable UI organized into atoms, molecules, organisms, and templates.
- Optimized responsive images through the Next.js Image component.
- Reduced-motion support in shared heading and scroll-reveal animations.
- Full authentication flow: email/password and Google sign-up, email OTP verification with resend, login with "remember me" and `returnUrl` redirects, forgot/reset password, and a Terms-of-Use acceptance gate for new Google accounts.

## Supported Languages

| Locale | Language |
| --- | --- |
| `en` | English |
| `fr` | French |
| `es` | Spanish |
| `sw` | Swahili |
| `pt` | Portuguese |

Localized URLs use a locale prefix, such as `/en/our-story` or `/fr/products`. English is the default locale. Some category labels fall back to their source English text when a translated taxonomy entry is unavailable.

## Public Routes

| Route | Description |
| --- | --- |
| `/` | Redirects to the default locale at `/en` |
| `/[locale]` | Marketplace homepage |
| `/[locale]/products` | Searchable and filterable product catalogue |
| `/[locale]/our-story` | Company story, mission, vision, and team |
| `/[locale]/what-we-do` | Marketplace services and technology |
| `/[locale]/our-impact` | Customer impact stories |
| `/[locale]/become-seller` | Supplier onboarding and subscription plans |
| `/[locale]/register` | Create a TOFA account with email/password or Google |
| `/[locale]/verify-email` | Enter the emailed OTP to activate a new account |
| `/[locale]/login` | Log in with email/password or Google, with "remember me" |
| `/[locale]/forgot-password` | Request a password-reset code by email |
| `/[locale]/reset-password` | Enter the reset code and choose a new password |
| Any unmatched localized URL | Localized custom 404 page |

## Tech Stack

- Next.js 16.2 App Router
- React 19.2
- TypeScript 5
- Tailwind CSS 4
- `next-intl` 4
- Framer Motion 12
- TanStack Query 5
- Base UI and shadcn/ui
- Lucide React
- Axios
- Sonner (toast notifications)
- Google Identity Services (Sign in with Google)

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
│   ├── providers/              # Client-side context providers
│   └── templates/              # Shared page layouts
├── features/                   # Feature-specific data, types, and constants
│   └── auth/                   # Auth feature: api/, hooks/, types/, helpers/, and its own
│                                # atoms/molecules/organisms/templates component tree
├── i18n/                       # Locale request and routing configuration
├── lib/                        # Shared hooks, helpers, constants, axios instance, and utilities
└── proxy.ts                    # Locale detection and routing proxy

messages/                       # Translation files by locale
public/
├── assets/                     # Images, icons, and static media
└── documents/                  # Downloadable seller policy documents
```

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm
- Git

### Installation

```bash
git clone git@github.com:tradersofafricateam/marketplace-v3-fe.git
cd marketplace-v3-fe
npm ci
```

Use `npm install` instead when intentionally changing dependencies and updating `package-lock.json`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To use a different port:

```bash
npm run dev -- -p 3004
```

### Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the previously generated production build |

There is currently no automated test command or configured test suite.

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API, e.g. `https://dev.tradersofafrica.com/api`. Used by the shared Axios instance (`src/lib/axiosInstance.ts`) for all authenticated requests. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | OAuth 2.0 client ID for "Continue with Google" (Google Identity Services). Without it, the Google button renders a disabled fallback instead of failing. |

Place these in `.env.local` and do not commit secrets.

## Product Catalogue

The catalogue stores search, filter, and sort state in the URL so views can be linked and revisited. It recognizes the following query parameters:

| Parameter | Purpose |
| --- | --- |
| `q` | Product or store search text |
| `collection` | Collection context: `popular` or `new` |
| `category` | Category ID |
| `minPrice`, `maxPrice` | Price range, stored in NGN |
| `rating` | Minimum rating |
| `verified` | Verified suppliers only when set to `1` |
| `inStock` | Ready-to-ship products only when set to `1` |
| `minOrder` | Maximum acceptable minimum-order quantity |
| `sort` | Sort order, such as `newest`, `price-low`, or `rating` |

Product records currently come from `src/features/products/constants/dummy.ts`. Currency selection is saved under `tofa-currency` in `localStorage`, and conversions use approximate hard-coded rates in `src/lib/helpers/currency/currency.ts`. These rates must be replaced with live exchange-rate data before production use. Catalogue pagination is currently presentational.

## Authentication

The auth feature lives entirely under `src/features/auth/` (API calls, hooks, types, helpers, and its own atoms/molecules/organisms/templates), with pages under `src/app/[locale]/{register,verify-email,login,forgot-password,reset-password}/`. Hooks own all state, validation, and mutations; components are presentational only.

- **Sign up** (`/register`) — email/password or Google. Email/password sign-up requires accepting the Terms of Use inline and always redirects to `/verify-email` on success. Google sign-up can create an account before Terms are accepted; in that case a modal gates continuing until `PATCH /auth/update-terms/:userId` succeeds.
- **Verify email** (`/verify-email`) — 6-digit OTP tied to the `token` returned by sign-up/login, with a resend cooldown.
- **Log in** (`/login`) — email/password or Google, with "remember me". If the account's email isn't verified yet, the API returns `requiresEmailVerification` and the app redirects to `/verify-email` instead of logging in. On success it redirects to a `returnUrl` query param if present, otherwise `/dashboard`.
- **Forgot / reset password** (`/forgot-password` → `/reset-password`) — request an OTP by email, then submit the OTP with a new password.
- **Session** — the JWT is stored in a `tofaToken` cookie (`src/features/auth/helpers/session.ts`), persisted 30 days when "remember me" is checked, session-only otherwise.
- **Google sign-in** requires `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (see Environment Variables). Without it, the Google button is shown disabled rather than throwing.

## Localization

Locale definitions live in `src/i18n/routing.ts`, while translations live in `messages/<locale>.json`. When adding user-facing copy:

1. Add the same key to every supported locale file.
2. Use `useTranslations` or the appropriate `next-intl` server API instead of hard-coded interface text.
3. Preserve the active locale in internal navigation.
4. Check category taxonomy coverage when adding or renaming categories.
5. Run lint and the production build before committing.

## Seller Policy Documents

Editable starter drafts and generated PDFs are stored in `public/documents`:

- `supplier-compliance.txt` and `supplier-compliance.pdf`
- `product-exclusions.txt` and `product-exclusions.pdf`

These documents are starting points and should receive legal review before production use.

## Production

Create and serve a production build with:

```bash
npm run build
npm run start
```

Deploy to a Next.js-compatible Node.js environment running Node 20.9 or later. The current locale proxy and image optimization setup are not configured for a plain static-file export.

Remote product and category images are permitted from Google Cloud Storage and Cloudinary in `next.config.ts`. Builds also use Google fonts through `next/font`, so restricted build environments must allow the required font downloads.

## Architecture Notes

- Build page sections from reusable Atomic Design components.
- Prefer Server Components unless browser state, event handlers, context, or animation hooks require a Client Component.
- The localized layout supplies `next-intl`, TanStack Query, and currency context providers.
- The project uses the Next.js 16 `proxy.ts` convention for locale routing.
- Consult the version-matched Next.js guides in `node_modules/next/dist/docs/` before changing framework APIs or conventions.

## Current Limitations

- Products, categories, exchange rates, ratings, stock states, and verification states use local demo data.
- Add-to-cart, wishlist, newsletter, checkout, and product-detail flows are not connected to a backend.
- `/dashboard` does not have a page yet; successful login redirects there per the API spec, but the route currently resolves to the localized 404 page.
- Login lockout/attempt-limit and OTP-expiry messaging is surfaced generically via whatever error text the API returns — there is no bespoke UI for those states.
- Pagination controls are visual placeholders and do not change the displayed result page.
- Some planned navigation destinations currently resolve to the localized 404 page.
- Automated tests have not been configured yet.

## License

This project is proprietary and owned by Traders of Africa. No open-source license is granted.
