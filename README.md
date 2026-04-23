# [Traders of Africa (TOFA) Marketplace](https://tradersofafrica.com)

[TOFA Marketplace](https://tradersofafrica.com) is a cross-border digital trade platform designed to connect African sellers with global buyers. Built with Next.js (App Router) and TypeScript, the platform enables businesses to showcase products, receive requests for quotations (RFQs), manage orders, communicate with buyers, and scale across borders.

The system is optimized for performance, SEO, and scalability, using a modular architecture and modern frontend tooling.

## Table of Contents

Features

Tech Stack

Project Structure

Getting Started

Prerequisites

Installation

Environment Variables

Running the App

SEO Optimizations

License

### Features

[TOFA Marketplace](https://tradersofafrica.com) provides a comprehensive B2B and B2C commerce experience:

Marketplace Core

Product Listings: Sellers can upload, edit, and manage products.

Global Discovery: Buyers from anywhere in the world can browse African products.

RFQ System (Request for Quotation):

Buyers request quotes for products

Sellers respond with pricing and terms

Buyers can accept quotes and proceed to order

Orders & Transactions

Order Management: Buyers can place orders directly or via accepted quotes

Seller-controlled Fulfillment: Sellers handle logistics and delivery

Wallet System: Supports payments and transaction tracking

Communication

Message Center:

Real-time communication between buyers and sellers

Supports negotiation and deal clarification

User & Business Management

Authentication:

Email/password

Google OAuth

Company Profiles:

Showcase business details, products, and services

User Dashboard:

Central hub for managing activity across the platform

### Additional Features

Cart System: Add, remove, and manage product quantities

Services Module: Businesses can list services alongside products

Language: Supports multiple languages (English, French, Portugues, Spanish, Arabic and Swahilii)

Currency: Supports multiple currencies (NNG, USD, GBP, EUR, GHS, KES KSH, XOF )

Notifications System: Email and in-app notifications

Admin & Moderation Ready:

Product moderation queue

User and transaction oversight

### Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS, Shadcn/UI

State Management: React Context and Zustand

API Requests: Axios

Architecture: Feature-based + Atomic Design

SEO:

Next.js Metadata API

Structured Data (JSON-LD)

Sitemap generation

Fonts: Google Fonts (Mulish, Poppins)

Formatting: Prettier

### Project Structure

The project is structured for scalability and modular development:

```bash
tofa-marketplace/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ └── [feature]/
│ └── page.tsx
├── components/
│ ├── atoms/
│ ├── molecules/
│ ├── organisms/
│ └── templates/
├── features/
│ ├── auth/
│ ├── products/
│ ├── quotes/
│ ├── orders/
│ ├── subscription/
│ ├── cart/
│ ├── messages/
│ ├── payments/
│ └── reviews/
├── lib/
│ ├── context/
│ ├── hooks/
│ ├── helpers/
│ └── utils.ts
├── public/
│ ├── images/
│ ├── icons/
├── styles/
│ └── global.css
├── types/
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Getting Started

TOFA Marketplace is built with a modular, feature-driven architecture that allows independent scaling of features like RFQs, orders, messaging, and wallets.

Prerequisites

Ensure you have:

Node.js (v18 or later)

```bash
npm / yarn / pnpm
```

Git

A code editor (VS Code recommended)

Installation

Clone the repository:

```bash
git clone https://github.com/your-repo/tofa-marketplace.git
cd tofa-marketplace
```

Install dependencies:

```bash
npm install
```

Environment Variables

Create a .env.local file in the root directory:

NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_AUTH_GOOGLE_ID=
NEXT_PUBLIC_AUTH_GOOGLE_SECRET=

Running the App

Start the development server:

```bash
npm run dev
```

Visit: http://localhost:3000

### SEO Optimizations

TOFA Marketplace is built with strong SEO foundations:

Dynamic metadata per page

Structured data for products and businesses

Optimized routing for discoverability

Sitemap and indexing support

Fast performance via Next.js App Router

### Additional Notes

Uses feature-based architecture for scalability

Atomic Design ensures reusable UI components

Tailwind CSS powers consistent styling

Built with cross-border trade in mind

### License

This project is proprietary and owned by Traders of Africa.
