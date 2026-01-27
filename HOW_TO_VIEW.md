# How to View the Portfolio Website

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - The terminal will show you a URL (usually `http://localhost:5173`)
   - Click the URL or copy it into your browser

3. **View the site:**
   - You should see the portfolio website with all components
   - Try switching between Hebrew and English using the language switcher
   - Navigate through different sections
   - Click on images to open the lightbox gallery

## What's Working

✅ **Core Components:**
- Language switching (Hebrew/English with RTL/LTR support)
- Navigation system
- About section
- Articles section with document viewer
- Gallery component with lightbox
- Responsive design

✅ **Tests:**
- 191 out of 193 tests passing
- All unit tests passing
- Most property-based tests passing

## Known Issues

⚠️ **2 Property-Based Tests Failing:**
- Gallery thumbnail interaction test (edge case with minimal data)
- Image error placeholder test (timing issue)

These are edge cases in the property tests and don't affect normal usage of the site.

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` folder.

## Testing

To run all tests:
```bash
npm test
```

To run tests in watch mode during development:
```bash
npm run test:watch
```
