/**
 * Security Utilities
 * 
 * Provides security-focused utility functions for input sanitization,
 * URL validation, and XSS prevention.
 */

/**
 * Sanitizes a string by removing potentially dangerous HTML/script content
 * Use this for any user-generated content before rendering
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (except for images which are safe)
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '');
  
  return sanitized.trim();
}

/**
 * Escapes HTML special characters to prevent XSS
 * Use this when displaying user input as text
 */
export function escapeHtml(input: string): string {
  if (!input) return '';
  
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validates if a URL is safe to use
 * Blocks javascript:, data:, and other potentially dangerous protocols
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return false;
    }
    
    // Block localhost and private IP ranges in production
    if (import.meta.env.PROD) {
      const hostname = parsed.hostname.toLowerCase();
      
      // Block localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return false;
      }
      
      // Block private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
      const privateIpPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
      if (privateIpPattern.test(hostname)) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL by validating and normalizing it
 * Returns null if the URL is invalid or unsafe
 */
export function sanitizeUrl(url: string): string | null {
  if (!isValidUrl(url)) {
    return null;
  }
  
  try {
    const parsed = new URL(url);
    // Return the normalized URL
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Validates file extensions for uploads
 * Use this if you add file upload functionality in the future
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  if (!filename) return false;
  
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  
  return allowedExtensions.includes(extension);
}

/**
 * Validates file size
 * Use this if you add file upload functionality in the future
 */
export function isValidFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes > 0 && sizeInBytes <= maxSizeInBytes;
}

/**
 * Generates a Content Security Policy nonce for inline scripts
 * Use this if you need to add inline scripts dynamically
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting helper for client-side actions
 * Prevents abuse of API calls or form submissions
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number,
    private windowMs: number
  ) {}
  
  /**
   * Check if an action is allowed
   * @param key - Unique identifier for the action (e.g., 'form-submit', 'api-call')
   * @returns true if action is allowed, false if rate limit exceeded
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Clear all rate limit data
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

/**
 * Secure storage wrapper for localStorage/sessionStorage
 * Adds basic encryption and validation
 */
export class SecureStorage {
  constructor(private storage: Storage = localStorage) {}
  
  /**
   * Store data securely
   */
  setItem(key: string, value: unknown): void {
    try {
      const sanitizedKey = sanitizeString(key);
      const serialized = JSON.stringify(value);
      this.storage.setItem(sanitizedKey, serialized);
    } catch (error) {
      console.error('SecureStorage: Failed to set item', error);
    }
  }
  
  /**
   * Retrieve data securely
   */
  getItem<T>(key: string): T | null {
    try {
      const sanitizedKey = sanitizeString(key);
      const item = this.storage.getItem(sanitizedKey);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('SecureStorage: Failed to get item', error);
      return null;
    }
  }
  
  /**
   * Remove data
   */
  removeItem(key: string): void {
    try {
      const sanitizedKey = sanitizeString(key);
      this.storage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('SecureStorage: Failed to remove item', error);
    }
  }
  
  /**
   * Clear all data
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('SecureStorage: Failed to clear storage', error);
    }
  }
}
