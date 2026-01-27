# Portfolio Website - Ofra Seri

A bilingual (Hebrew/English) portfolio website showcasing academic work, exhibitions, and student artwork.

## Project Setup

This project uses:
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Sass/CSS Modules** for styling
- **Vitest** + React Testing Library for unit testing
- **fast-check** for property-based testing

## Folder Structure

```
src/
├── components/     # React components
├── services/       # Business logic and data management
├── assets/         # Images, fonts, and static assets
├── locales/        # Translation files (he.json, en.json)
├── types/          # TypeScript type definitions
├── styles/         # Global styles and variables
└── test/           # Test setup and utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (fast, skips type checking)
- `npm run build:check` - Build with full TypeScript type checking
- `npm run preview` - Preview production build locally
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Deployment

For comprehensive deployment instructions, including:
- Environment configuration
- Build optimization details
- Deployment to various hosting platforms
- Content management (adding articles, images, links)
- Troubleshooting and performance optimization

See the **[Deployment Guide](./DEPLOYMENT.md)**

### Quick Deploy

```bash
# Build for production
npm run build

# Preview locally
npm run preview

# Deploy the dist/ folder to your hosting service
```

## Design

The website features a Yemenite art-inspired design with:
- Warm color palette (terracotta, deep blue, gold, cream)
- Support for RTL (Hebrew) and LTR (English) text directions
- Responsive layout for mobile, tablet, and desktop
- Accessible navigation and interactions

## Testing

The project uses a dual testing approach:
- **Unit tests** for specific examples and edge cases
- **Property-based tests** for universal correctness properties

All tests are located alongside their source files with `.test.tsx` extension.
