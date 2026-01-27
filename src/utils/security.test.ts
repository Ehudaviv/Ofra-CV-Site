import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sanitizeString,
  escapeHtml,
  isValidUrl,
  sanitizeUrl,
  isValidFileExtension,
  isValidFileSize,
  RateLimiter,
  SecureStorage,
} from './security';

describe('sanitizeString', () => {
  it('should remove script tags', () => {
    const input = 'Hello <script>alert("xss")</script> World';
    const result = sanitizeString(input);
    expect(result).toBe('Hello  World');
  });

  it('should remove event handlers', () => {
    const input = '<div onclick="alert(1)">Click me</div>';
    const result = sanitizeString(input);
    expect(result).not.toContain('onclick');
  });

  it('should remove javascript: protocol', () => {
    const input = '<a href="javascript:alert(1)">Link</a>';
    const result = sanitizeString(input);
    expect(result).not.toContain('javascript:');
  });

  it('should handle empty strings', () => {
    expect(sanitizeString('')).toBe('');
  });
});

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    const input = '<script>alert("test")</script>';
    const result = escapeHtml(input);
    expect(result).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;&#x2F;script&gt;');
  });

  it('should escape ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('isValidUrl', () => {
  it('should accept valid HTTPS URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('should accept valid HTTP URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  it('should reject javascript: protocol', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
  });

  it('should reject data: protocol', () => {
    expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('should reject empty strings', () => {
    expect(isValidUrl('')).toBe(false);
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });
});

describe('sanitizeUrl', () => {
  it('should return normalized valid URLs', () => {
    const result = sanitizeUrl('https://example.com/path');
    expect(result).toBe('https://example.com/path');
  });

  it('should return null for invalid URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe(null);
  });

  it('should return null for empty strings', () => {
    expect(sanitizeUrl('')).toBe(null);
  });
});

describe('isValidFileExtension', () => {
  it('should accept allowed extensions', () => {
    expect(isValidFileExtension('document.pdf', ['pdf', 'docx'])).toBe(true);
  });

  it('should reject disallowed extensions', () => {
    expect(isValidFileExtension('script.exe', ['pdf', 'docx'])).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isValidFileExtension('document.PDF', ['pdf'])).toBe(true);
  });

  it('should handle files without extensions', () => {
    expect(isValidFileExtension('noextension', ['pdf'])).toBe(false);
  });
});

describe('isValidFileSize', () => {
  it('should accept files within size limit', () => {
    const fiveMB = 5 * 1024 * 1024;
    expect(isValidFileSize(fiveMB, 10)).toBe(true);
  });

  it('should reject files exceeding size limit', () => {
    const fifteenMB = 15 * 1024 * 1024;
    expect(isValidFileSize(fifteenMB, 10)).toBe(false);
  });

  it('should reject zero-size files', () => {
    expect(isValidFileSize(0, 10)).toBe(false);
  });

  it('should reject negative sizes', () => {
    expect(isValidFileSize(-100, 10)).toBe(false);
  });
});

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should allow actions within rate limit', () => {
    const limiter = new RateLimiter(3, 1000);
    
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(true);
  });

  it('should block actions exceeding rate limit', () => {
    const limiter = new RateLimiter(2, 1000);
    
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(false);
  });

  it('should reset after time window', () => {
    const limiter = new RateLimiter(2, 1000);
    
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(false);
    
    vi.advanceTimersByTime(1001);
    
    expect(limiter.isAllowed('test')).toBe(true);
  });

  it('should track different keys separately', () => {
    const limiter = new RateLimiter(1, 1000);
    
    expect(limiter.isAllowed('key1')).toBe(true);
    expect(limiter.isAllowed('key2')).toBe(true);
    expect(limiter.isAllowed('key1')).toBe(false);
    expect(limiter.isAllowed('key2')).toBe(false);
  });

  it('should reset specific key', () => {
    const limiter = new RateLimiter(1, 1000);
    
    expect(limiter.isAllowed('test')).toBe(true);
    expect(limiter.isAllowed('test')).toBe(false);
    
    limiter.reset('test');
    
    expect(limiter.isAllowed('test')).toBe(true);
  });
});

describe('SecureStorage', () => {
  let mockStorage: Storage;
  let secureStorage: SecureStorage;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    secureStorage = new SecureStorage(mockStorage);
  });

  it('should store and retrieve data', () => {
    const testData = { name: 'Test', value: 123 };
    
    vi.mocked(mockStorage.setItem).mockImplementation((key, value) => {
      vi.mocked(mockStorage.getItem).mockReturnValue(value);
    });
    
    secureStorage.setItem('test', testData);
    expect(mockStorage.setItem).toHaveBeenCalled();
    
    const retrieved = secureStorage.getItem('test');
    expect(retrieved).toEqual(testData);
  });

  it('should return null for non-existent items', () => {
    vi.mocked(mockStorage.getItem).mockReturnValue(null);
    
    const result = secureStorage.getItem('nonexistent');
    expect(result).toBe(null);
  });

  it('should remove items', () => {
    secureStorage.removeItem('test');
    expect(mockStorage.removeItem).toHaveBeenCalled();
  });

  it('should clear all items', () => {
    secureStorage.clear();
    expect(mockStorage.clear).toHaveBeenCalled();
  });
});
