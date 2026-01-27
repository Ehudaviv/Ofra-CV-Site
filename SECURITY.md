# Security Documentation

This document outlines the security measures implemented in the portfolio website.

## Security Headers

### Content Security Policy (CSP)
The site implements a strict Content Security Policy to prevent XSS attacks:

- **default-src 'self'**: Only load resources from the same origin by default
- **script-src 'self' 'unsafe-inline'**: Allow scripts from same origin and inline scripts (required for Vite)
- **style-src 'self' 'unsafe-inline' https://fonts.googleapis.com**: Allow styles from same origin, inline styles, and Google Fonts
- **font-src 'self' https://fonts.gstatic.com**: Allow fonts from same origin and Google Fonts CDN
- **img-src 'self' data: https:**: Allow images from same origin, data URIs, and HTTPS sources
- **frame-ancestors 'none'**: Prevent the site from being embedded in iframes (clickjacking protection)
- **upgrade-insecure-requests**: Automatically upgrade HTTP requests to HTTPS

### Additional Security Headers

- **X-Frame-Options: DENY**: Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff**: Prevents MIME type sniffing
- **X-XSS-Protection: 1; mode=block**: Enables browser XSS protection
- **Referrer-Policy: strict-origin-when-cross-origin**: Controls referrer information
- **Strict-Transport-Security**: Forces HTTPS connections (production only)
- **Permissions-Policy**: Restricts access to browser features (geolocation, camera, etc.)

## External Links Security

All external links include:
- `target="_blank"`: Opens in new tab
- `rel="noopener noreferrer"`: Prevents reverse tabnapping attacks and referrer leakage

## Security Utilities

The `src/utils/security.ts` file provides security utilities:

### Input Sanitization
- `sanitizeString()`: Removes dangerous HTML/script content
- `escapeHtml()`: Escapes HTML special characters
- `sanitizeUrl()`: Validates and normalizes URLs

### URL Validation
- `isValidUrl()`: Validates URL safety (blocks javascript:, data:, etc.)
- Blocks localhost and private IPs in production

### File Validation (for future use)
- `isValidFileExtension()`: Validates file extensions
- `isValidFileSize()`: Validates file sizes

### Rate Limiting
- `RateLimiter` class: Client-side rate limiting for forms/API calls
- Prevents abuse and brute force attempts

### Secure Storage
- `SecureStorage` class: Wrapper for localStorage/sessionStorage
- Adds sanitization and error handling

## Service Worker Security

The service worker (`public/sw.js`):
- Only caches GET requests
- Validates request protocols (skips non-HTTP)
- Implements proper cache versioning
- Uses secure caching strategies

## Build Security

Production builds:
- Remove console.log statements
- Remove debugger statements
- Minify and obfuscate code
- No source maps in production (set to false)

## Environment Variables

- Only variables prefixed with `VITE_` are exposed to the client
- Sensitive data should never be in client-side code
- Use `.env.example` for documentation, never commit `.env` files

## Deployment Security

### Netlify/Vercel
The `public/_headers` file configures security headers for production deployment.

### Cache Control
- Static assets: Cached for 1 year (immutable)
- Service worker: No caching (always fresh)
- HTML files: No caching (always fresh)

## Best Practices

1. **Never trust user input**: Always sanitize and validate
2. **Use HTTPS**: All external resources use HTTPS
3. **Keep dependencies updated**: Regularly update npm packages
4. **Review external links**: Ensure all external URLs are legitimate
5. **Monitor security advisories**: Check for vulnerabilities in dependencies

## Security Checklist for Future Features

When adding new features, ensure:

- [ ] User input is sanitized using `sanitizeString()` or `escapeHtml()`
- [ ] URLs are validated using `isValidUrl()` before use
- [ ] External links include `rel="noopener noreferrer"`
- [ ] Forms implement rate limiting using `RateLimiter`
- [ ] File uploads validate extension and size
- [ ] API calls use HTTPS only
- [ ] Sensitive data is never stored in localStorage without encryption
- [ ] Error messages don't leak sensitive information

## Reporting Security Issues

If you discover a security vulnerability, please contact the site administrator directly rather than opening a public issue.

## Security Audit

Last security review: January 2026

Recommended: Perform security audits quarterly and after major updates.

## Tools for Security Testing

- **npm audit**: Check for vulnerable dependencies
- **Lighthouse**: Security audit in Chrome DevTools
- **OWASP ZAP**: Web application security scanner
- **Mozilla Observatory**: Security header checker

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
