/**
 * ArticlesSection Component
 * 
 * Displays a list of academic articles with titles and summaries.
 * Provides download functionality for articles.
 * Connects to I18nService for article title translations.
 * Requirements: 2.1, 2.2, 2.6
 */

import { useState, useEffect } from 'react';
import { getI18nService } from '../services/I18nService';
import { getContentManager, Article } from '../services/ContentManager';
import styles from './ArticlesSection.module.scss';
import enTranslations from '../locales/en.json';
import heTranslations from '../locales/he.json';

interface ArticlesSectionProps {
  className?: string;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ className }) => {
  const i18nService = getI18nService();
  const contentManager = getContentManager();
  
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const [direction, setDirection] = useState(i18nService.getDirection());
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load translations if not already loaded
    i18nService.loadTranslations('en', enTranslations);
    i18nService.loadTranslations('he', heTranslations);

    // Subscribe to language changes
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguage(lang);
      setDirection(i18nService.getDirection());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedArticles = await contentManager.loadArticles();
      setArticles(loadedArticles);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError(i18nService.translate('errors.noContent'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (article: Article) => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = article.filePath;
    link.download = article.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const title = i18nService.translate('articles.title');

  return (
    <section 
      id="articles"
      className={`${styles.articlesSection} ${className || ''}`}
      dir={direction}
      aria-labelledby="articles-title"
    >
      <div className={styles.container}>
        <h2 id="articles-title" className={styles.title}>{title}</h2>
        
        {isLoading && (
          <div className={styles.loading} role="status" aria-live="polite">
            {i18nService.translate('common.loading')}
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
            <button onClick={loadArticles} className={styles.retryButton}>
              {i18nService.translate('common.retry') || 'Retry'}
            </button>
          </div>
        )}

        {!isLoading && !error && articles.length > 0 && (
          <div className={styles.articleList}>
            {articles.map((article) => (
              <article key={article.id} className={styles.articleCard}>
                <div className={styles.articleHeader}>
                  <h3 className={styles.articleTitle}>
                    {i18nService.translate(`${article.titleKey}.title`)}
                  </h3>
                </div>
                
                <p className={styles.articleSummary}>
                  {i18nService.translate(`${article.titleKey}.summary`)}
                </p>
                
                <button
                  className={styles.downloadButton}
                  onClick={() => handleDownload(article)}
                  aria-label={`${i18nService.translate('common.download') || 'Download'} ${i18nService.translate(`${article.titleKey}.title`)}`}
                >
                  <span>{i18nService.translate('common.download') || 'Download'}</span>
                </button>
              </article>
            ))}
          </div>
        )}

        {!isLoading && !error && articles.length === 0 && (
          <p className={styles.emptyState}>
            {i18nService.translate('errors.noContent')}
          </p>
        )}
      </div>
    </section>
  );
};
