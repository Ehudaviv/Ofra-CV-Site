# Deployment Guide

This document provides comprehensive instructions for building, deploying, and maintaining the Ofra Seri Portfolio Website.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Build Process](#build-process)
4. [Deployment Options](#deployment-options)
5. [Content Management](#content-management)
6. [Troubleshooting](#troubleshooting)
7. [Performance Optimization](#performance-optimization)

---

## Prerequisites

### Required Software

- **Node.js**: Version 20.16.0 or higher (or 22.3.0+)
- **npm**: Version 10.0.0 or higher
- **Git**: For version control

### Verify Installation

```bash
node --version
npm --version
```

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The application uses environment variables for configuration. Create environment files based on your deployment target:

#### Development Environment

Create `.env.local` for local development:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local settings:

```env
VITE_BASE_URL=/
VITE_ARTICLES_PATH=/מאמרים
VITE_EXHIBITIONS_PATH=/תמונות
VITE_STUDENT_ART_PATH=/ציורים בהנחייתי
VITE_DEFAULT_LANGUAGE=he
VITE_IMAGE_QUALITY=85
VITE_THUMBNAIL_SIZE=400
```

#### Production Environment

The `.env.production` file is already configured with production defaults. Modify it if needed for your specific deployment:

```env
VITE_BASE_URL=/
VITE_ARTICLES_PATH=/מאמרים
VITE_EXHIBITIONS_PATH=/תמונות
VITE_STUDENT_ART_PATH=/ציורים בהנחייתי
VITE_DEFAULT_LANGUAGE=he
VITE_IMAGE_QUALITY=85
VITE_THUMBNAIL_SIZE=400
```

**Note**: Only environment variables prefixed with `VITE_` are exposed to the client-side code.

---

## Build Process

### Development Build

Run the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

This command:
1. Compiles TypeScript code
2. Bundles JavaScript with code splitting
3. Optimizes and minifies CSS
4. Compresses images and assets
5. Generates production-ready files in the `dist/` directory

#### Build Output Structure

```
dist/
├── index.html                          # Main HTML file
├── assets/
│   ├── css/
│   │   └── main-[hash].css            # Minified CSS
│   ├── js/
│   │   ├── main-[hash].js             # Main application code
│   │   ├── react-vendor-[hash].js     # React libraries
│   │   ├── pdf-vendor-[hash].js       # PDF.js library
│   │   └── docx-vendor-[hash].js      # Mammoth.js library
│   ├── images/
│   │   └── [optimized images]
│   └── fonts/
│       └── [font files]
├── מאמרים/                             # Articles folder
├── תמונות/                             # Exhibition images
└── ציורים בהנחייתי/                    # Student artwork
```

### Build with Type Checking

To run a build with full TypeScript type checking:

```bash
npm run build:check
```

**Note**: The default `npm run build` skips type checking for faster builds. Use `build:check` before deploying to catch type errors.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

The production build will be served at `http://localhost:4173`

---

## Deployment Options

### Option 1: Static Hosting (Recommended)

The application is a static site and can be deployed to any static hosting service.

#### Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Configure** `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

3. **Configure** `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

#### GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script** to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure base URL** in `.env.production`:
   ```env
   VITE_BASE_URL=/repository-name/
   ```

### Option 2: Traditional Web Server

Deploy to Apache, Nginx, or any web server:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Copy `dist/` contents** to your web server's document root:
   ```bash
   scp -r dist/* user@server:/var/www/html/
   ```

3. **Configure server** for single-page application routing:

   **Nginx** (`/etc/nginx/sites-available/default`):
   ```nginx
   server {
     listen 80;
     server_name example.com;
     root /var/www/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
     
     # Cache static assets
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

   **Apache** (`.htaccess`):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   
   # Cache static assets
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/gif "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType text/css "access plus 1 year"
     ExpiresByType application/javascript "access plus 1 year"
   </IfModule>
   ```

---

## Content Management

### Adding New Articles

1. **Prepare the document**:
   - Supported formats: PDF, DOCX
   - Place the file in the `מאמרים/` folder

2. **Update translations**:
   
   Edit `src/locales/he.json`:
   ```json
   {
     "articles": {
       "article5": "כותרת המאמר החדש"
     }
   }
   ```
   
   Edit `src/locales/en.json`:
   ```json
   {
     "articles": {
       "article5": "New Article Title"
     }
   }
   ```

3. **Update ContentManager** (if needed):
   
   The ContentManager automatically discovers files in the articles folder. If you need to customize the order or add metadata, edit `src/services/ContentManager.ts`.

4. **Rebuild and deploy**:
   ```bash
   npm run build
   # Deploy using your chosen method
   ```

### Adding Exhibition Images

1. **Prepare images**:
   - Recommended formats: JPEG, PNG
   - Recommended size: Max 2000px width for optimal loading
   - Place files in the `תמונות/` folder

2. **Update translations** for captions:
   
   Edit `src/locales/he.json`:
   ```json
   {
     "exhibitions": {
       "exhibition16": "תיאור התערוכה החדשה"
     }
   }
   ```
   
   Edit `src/locales/en.json`:
   ```json
   {
     "exhibitions": {
       "exhibition16": "New Exhibition Description"
     }
   }
   ```

3. **Update the count** in `ExhibitionsSection.tsx` if you change the number of images:
   ```typescript
   // Update the expected count
   const images = await contentManager.loadExhibitionImages();
   ```

4. **Rebuild and deploy**:
   ```bash
   npm run build
   ```

### Adding Student Artwork

1. **Prepare images**:
   - Recommended formats: JPEG, PNG
   - Place files in the `ציורים בהנחייתי/` folder

2. **Update translations**:
   
   Edit `src/locales/he.json`:
   ```json
   {
     "studentArt": {
       "artwork17": "תיאור היצירה החדשה"
     }
   }
   ```
   
   Edit `src/locales/en.json`:
   ```json
   {
     "studentArt": {
       "artwork17": "New Artwork Description"
     }
   }
   ```

3. **Rebuild and deploy**:
   ```bash
   npm run build
   ```

### Updating External Links

Edit `src/components/ExternalLinks.tsx`:

```typescript
const links: ExternalLink[] = [
  // ... existing links
  {
    id: 'link12',
    titleKey: 'links.link12',
    url: 'https://example.com/new-link',
  },
];
```

Update translations in both `he.json` and `en.json`:

```json
{
  "links": {
    "link12": "New Link Title"
  }
}
```

### Updating Biography

Edit the About section translations:

**Hebrew** (`src/locales/he.json`):
```json
{
  "about": {
    "biography": "הביוגרפיה המעודכנת..."
  }
}
```

**English** (`src/locales/en.json`):
```json
{
  "about": {
    "biography": "Updated biography..."
  }
}
```

---

## Troubleshooting

### Build Fails with TypeScript Errors

If `npm run build:check` fails with TypeScript errors:

1. **Review the errors** and fix type issues
2. **Use the faster build** without type checking:
   ```bash
   npm run build
   ```
3. **Fix type errors incrementally** in development

### Images Not Loading

1. **Check file paths** match the environment variables
2. **Verify files exist** in the correct folders
3. **Check file permissions** on the server
4. **Inspect browser console** for 404 errors

### PDF/DOCX Files Not Opening

1. **Verify file format** is valid PDF or DOCX
2. **Check file size** - very large files may timeout
3. **Test locally** with `npm run preview`
4. **Check browser console** for errors

### Language Switching Not Working

1. **Clear browser cache** and localStorage
2. **Verify translations** exist in both `he.json` and `en.json`
3. **Check browser console** for missing translation keys

### Service Worker Issues

If caching causes problems:

1. **Clear service worker**:
   - Open DevTools → Application → Service Workers
   - Click "Unregister"
2. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Disable service worker** in development by setting:
   ```env
   VITE_SW_ENABLED=false
   ```

---

## Performance Optimization

### Bundle Size Analysis

Analyze the production bundle:

```bash
npm run build
```

Review the output for chunk sizes. The build is configured with:
- **Code splitting**: Vendor libraries separated into chunks
- **Tree shaking**: Unused code eliminated
- **Minification**: JavaScript and CSS compressed
- **Asset optimization**: Images inlined if < 4KB

### Image Optimization

For better performance:

1. **Compress images** before adding:
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Target: < 200KB per image

2. **Use appropriate formats**:
   - JPEG for photos
   - PNG for graphics with transparency
   - WebP for modern browsers (future enhancement)

3. **Resize images**:
   - Max width: 2000px for full-size
   - Thumbnails: 400px (configured in env)

### Caching Strategy

The service worker caches:
- Static assets (JS, CSS, fonts)
- Images
- Documents

**Cache invalidation**: Happens automatically when files change (hash-based filenames).

### Performance Monitoring

Monitor performance with:
- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

Target metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Security

The application implements comprehensive security measures. See [SECURITY.md](./SECURITY.md) for full details.

### Security Headers

The site includes security headers configured in:
- `index.html`: Meta tags for CSP and security headers
- `public/_headers`: Production headers for Netlify/Vercel

Headers include:
- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **Strict-Transport-Security**: Forces HTTPS
- **X-Content-Type-Options**: Prevents MIME sniffing

### Security Utilities

Use the security utilities in `src/utils/security.ts` for:
- Input sanitization: `sanitizeString()`, `escapeHtml()`
- URL validation: `isValidUrl()`, `sanitizeUrl()`
- Rate limiting: `RateLimiter` class
- Secure storage: `SecureStorage` class

### Security Checklist

Before deploying:

1. **Environment Variables**: Never commit `.env.local` or files containing secrets
2. **Dependencies**: Regularly update and audit:
   ```bash
   npm audit
   npm update
   ```
3. **HTTPS**: Always deploy with HTTPS enabled (automatic on Netlify/Vercel)
4. **Headers**: Verify security headers are applied in production
5. **External Links**: All external links use `rel="noopener noreferrer"`
6. **Content**: Review all user-facing content for sensitive information

---

## Support

For issues or questions:
1. Check this documentation
2. Review the [README.md](./README.md)
3. Check the browser console for errors
4. Review the [requirements](./kiro/specs/portfolio-website/requirements.md) and [design](./kiro/specs/portfolio-website/design.md) documents

---

## Version History

- **v1.0.0** (2026-01-21): Initial deployment documentation
