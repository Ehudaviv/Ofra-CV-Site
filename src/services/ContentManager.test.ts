/**
 * Unit tests for ContentManager
 * Requirements: 2.1, 3.1, 4.1
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ContentManager, Article, GalleryImage } from './ContentManager';

describe('ContentManager - Unit Tests', () => {
  let manager: ContentManager;

  beforeEach(() => {
    manager = new ContentManager();
  });

  describe('Article Loading', () => {
    it('should load exactly 4 articles', async () => {
      const articles = await manager.loadArticles();
      expect(articles).toHaveLength(4);
    });

    it('should return articles with correct structure', async () => {
      const articles = await manager.loadArticles();
      
      articles.forEach((article: Article) => {
        expect(article).toHaveProperty('id');
        expect(article).toHaveProperty('filename');
        expect(article).toHaveProperty('titleKey');
        expect(article).toHaveProperty('fileType');
        expect(article).toHaveProperty('filePath');
        expect(typeof article.id).toBe('string');
        expect(typeof article.filename).toBe('string');
        expect(typeof article.titleKey).toBe('string');
        expect(['pdf', 'docx']).toContain(article.fileType);
        expect(typeof article.filePath).toBe('string');
      });
    });

    it('should include both PDF and DOCX articles', async () => {
      const articles = await manager.loadArticles();
      const pdfArticles = articles.filter(a => a.fileType === 'pdf');
      const docxArticles = articles.filter(a => a.fileType === 'docx');
      
      expect(pdfArticles.length).toBeGreaterThan(0);
      expect(docxArticles.length).toBeGreaterThan(0);
    });

    it('should cache articles after first load', async () => {
      const firstLoad = await manager.loadArticles();
      const secondLoad = await manager.loadArticles();
      
      expect(firstLoad).toBe(secondLoad); // Same reference
    });

    it('should have unique article IDs', async () => {
      const articles = await manager.loadArticles();
      const ids = articles.map(a => a.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(articles.length);
    });
  });

  describe('Exhibition Images Loading', () => {
    it('should load exhibition images', async () => {
      const images = await manager.loadExhibitionImages();
      expect(images.length).toBeGreaterThan(0);
    });

    it('should return images with correct structure', async () => {
      const images = await manager.loadExhibitionImages();
      
      images.forEach((image: GalleryImage) => {
        expect(image).toHaveProperty('id');
        expect(image).toHaveProperty('filename');
        expect(image).toHaveProperty('thumbnailUrl');
        expect(image).toHaveProperty('fullUrl');
        expect(image).toHaveProperty('captionKey');
        expect(image).toHaveProperty('alt');
        expect(typeof image.id).toBe('string');
        expect(typeof image.filename).toBe('string');
        expect(typeof image.thumbnailUrl).toBe('string');
        expect(typeof image.fullUrl).toBe('string');
        expect(typeof image.captionKey).toBe('string');
        expect(typeof image.alt).toBe('string');
      });
    });

    it('should cache exhibition images after first load', async () => {
      const firstLoad = await manager.loadExhibitionImages();
      const secondLoad = await manager.loadExhibitionImages();
      
      expect(firstLoad).toBe(secondLoad); // Same reference
    });

    it('should have unique image IDs', async () => {
      const images = await manager.loadExhibitionImages();
      const ids = images.map(i => i.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(images.length);
    });

    it('should have valid URLs for thumbnails and full images', async () => {
      const images = await manager.loadExhibitionImages();
      
      images.forEach((image: GalleryImage) => {
        expect(image.thumbnailUrl).toContain('/תמונות/');
        expect(image.fullUrl).toContain('/תמונות/');
      });
    });
  });

  describe('Student Artwork Loading', () => {
    it('should load exactly 16 student artwork images', async () => {
      const images = await manager.loadStudentArtImages();
      expect(images).toHaveLength(16);
    });

    it('should return images with correct structure', async () => {
      const images = await manager.loadStudentArtImages();
      
      images.forEach((image: GalleryImage) => {
        expect(image).toHaveProperty('id');
        expect(image).toHaveProperty('filename');
        expect(image).toHaveProperty('thumbnailUrl');
        expect(image).toHaveProperty('fullUrl');
        expect(image).toHaveProperty('captionKey');
        expect(image).toHaveProperty('alt');
        expect(typeof image.id).toBe('string');
        expect(typeof image.filename).toBe('string');
        expect(typeof image.thumbnailUrl).toBe('string');
        expect(typeof image.fullUrl).toBe('string');
        expect(typeof image.captionKey).toBe('string');
        expect(typeof image.alt).toBe('string');
      });
    });

    it('should cache student artwork images after first load', async () => {
      const firstLoad = await manager.loadStudentArtImages();
      const secondLoad = await manager.loadStudentArtImages();
      
      expect(firstLoad).toBe(secondLoad); // Same reference
    });

    it('should have unique image IDs', async () => {
      const images = await manager.loadStudentArtImages();
      const ids = images.map(i => i.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(images.length);
    });

    it('should have valid URLs for thumbnails and full images', async () => {
      const images = await manager.loadStudentArtImages();
      
      images.forEach((image: GalleryImage) => {
        expect(image.thumbnailUrl).toContain('/ציורים בהנחייתי/');
        expect(image.fullUrl).toContain('/ציורים בהנחייתי/');
      });
    });
  });

  describe('Image Optimization', () => {
    it('should return optimized image URL', async () => {
      const originalPath = '/images/test.jpg';
      const optimizedUrl = await manager.optimizeImage(originalPath, 'thumbnail');
      
      expect(typeof optimizedUrl).toBe('string');
      expect(optimizedUrl).toBe(originalPath); // Currently returns original
    });

    it('should handle full size optimization', async () => {
      const originalPath = '/images/test.jpg';
      const optimizedUrl = await manager.optimizeImage(originalPath, 'full');
      
      expect(typeof optimizedUrl).toBe('string');
      expect(optimizedUrl).toBe(originalPath);
    });
  });

  describe('Cache Management', () => {
    it('should clear all caches', async () => {
      // Load all content to populate caches
      await manager.loadArticles();
      await manager.loadExhibitionImages();
      await manager.loadStudentArtImages();
      
      // Clear cache
      manager.clearCache();
      
      // Load again - should get new instances
      const articles1 = await manager.loadArticles();
      manager.clearCache();
      const articles2 = await manager.loadArticles();
      
      expect(articles1).not.toBe(articles2); // Different references after cache clear
    });
  });

  describe('Custom Configuration', () => {
    it('should accept custom paths in configuration', () => {
      const customManager = new ContentManager({
        articlesPath: '/custom/articles',
        exhibitionsPath: '/custom/exhibitions',
        studentArtPath: '/custom/student-art'
      });
      
      expect(customManager).toBeDefined();
    });

    it('should use custom paths in loaded content', async () => {
      const customManager = new ContentManager({
        articlesPath: '/custom/articles'
      });
      
      const articles = await customManager.loadArticles();
      articles.forEach((article: Article) => {
        expect(article.filePath).toContain('/custom/articles/');
      });
    });
  });
});
