/**
 * ExternalLinks Component
 * 
 * Displays a list of external links to exhibitions, events, and resources.
 * All links open in new tabs with proper security attributes.
 * Supports bilingual content with proper ARIA labels for accessibility.
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { useState, useEffect } from 'react';
import { getI18nService } from '../services/I18nService';
import styles from './ExternalLinks.module.scss';
import enTranslations from '../locales/en.json';
import heTranslations from '../locales/he.json';

export interface ExternalLink {
  id: string;
  titleKey: string;
  descriptionKey: string;
  url: string;
  category: string;
}

interface ExternalLinksProps {
  className?: string;
}

// External links with real URLs and descriptions
const externalLinks: ExternalLink[] = [
  { 
    id: 'link1', 
    titleKey: 'links.link1.title',
    descriptionKey: 'links.link1.description',
    url: 'https://www.instagram.com/p/C-mdd5uooSp/?img_index=1',
    category: 'exhibition'
  },
  { 
    id: 'link2', 
    titleKey: 'links.link2.title',
    descriptionKey: 'links.link2.description',
    url: 'https://www.instagram.com/p/DKcJCBFIJ1O/',
    category: 'exhibition'
  },
  { 
    id: 'link3', 
    titleKey: 'links.link3.title',
    descriptionKey: 'links.link3.description',
    url: 'https://www.instagram.com/p/DBHAtG2O2co/',
    category: 'exhibition'
  },
  { 
    id: 'link4', 
    titleKey: 'links.link4.title',
    descriptionKey: 'links.link4.description',
    url: 'https://www.be106.net/233/106745',
    category: 'event'
  },
  { 
    id: 'link5', 
    titleKey: 'links.link5.title',
    descriptionKey: 'links.link5.description',
    url: 'https://www.prtfl.co.il/archives/209044',
    category: 'article'
  },
  { 
    id: 'link6', 
    titleKey: 'links.link6.title',
    descriptionKey: 'links.link6.description',
    url: 'https://www.ynet.co.il/activism/article/rke3rxj9ke?utm_source=ynet.app.android&utm_medium=social&utm_campaign=general_share&utm_term=rke3rxj9ke&utm_content=Header',
    category: 'article'
  },
  { 
    id: 'link7', 
    titleKey: 'links.link7.title',
    descriptionKey: 'links.link7.description',
    url: 'https://www.facebook.com/editshalev/videos/%D7%90%D7%94%D7%95%D7%91%D7%95%D7%AA%D7%90%D7%A0%D7%99-%D7%A2%D7%95%D7%93-%D7%9E%D7%AA%D7%90%D7%95%D7%A9%D7%A9%D7%AA-%D7%9E%D7%94%D7%9E%D7%90%D7%95%D7%A8%D7%A2%D7%95%D7%AA-%D7%90%D7%AA%D7%9E%D7%95%D7%9C-%D7%A4%D7%A9%D7%95%D7%98-%D7%A7%D7%99%D7%91%D7%9C%D7%AA%D7%99-%D7%9B%D7%96%D7%94-%D7%91%D7%95%D7%A1%D7%98-%D7%A9%D7%9C-%D7%9B%D7%95%D7%97-%D7%9E%D7%9B%D7%9F-%D7%A9%D7%99%D7%A7%D7%97-%D7%9C%D7%99-%D7%A7%D7%A6/274805217791353/',
    category: 'workshop'
  },
  { 
    id: 'link8', 
    titleKey: 'links.link8.title',
    descriptionKey: 'links.link8.description',
    url: 'https://mr.localtimeline.com/?lang=he&timeline=1&view=event&id=334&showAsset=image&showId=4243&whatsapp=1#showAsset-image-4243',
    category: 'event'
  },
  { 
    id: 'link9', 
    titleKey: 'links.link9.title',
    descriptionKey: 'links.link9.description',
    url: 'https://www.facebook.com/100063593022481/posts/1429988852464202/',
    category: 'lecture'
  },
  { 
    id: 'link10', 
    titleKey: 'links.link10.title',
    descriptionKey: 'links.link10.description',
    url: 'https://www.instagram.com/p/DSsYstxjQfq/',
    category: 'exhibition'
  },
  { 
    id: 'link11', 
    titleKey: 'links.link11.title',
    descriptionKey: 'links.link11.description',
    url: 'https://www.facebook.com/photo.php?fbid=122108393030101553&set=a.122097083528101553&type=3',
    category: 'artwork'
  },
];

export const ExternalLinks: React.FC<ExternalLinksProps> = ({ className }) => {
  const i18nService = getI18nService();
  const [language, setLanguage] = useState(i18nService.getLanguage());
  const [direction, setDirection] = useState(i18nService.getDirection());

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
  }, [i18nService]);

  const title = i18nService.translate('links.title');

  return (
    <section 
      id="links"
      className={`${styles.externalLinks} ${className || ''}`}
      dir={direction}
      aria-labelledby="links-title"
    >
      <div className={styles.container}>
        <h2 id="links-title" className={styles.title}>{title}</h2>
        
        <div className={styles.linksList}>
          {externalLinks.map((link) => {
            const linkTitle = i18nService.translate(link.titleKey);
            const linkDescription = i18nService.translate(link.descriptionKey);
            const ariaLabel = language === 'he' 
              ? `${linkTitle} (נפתח בחלון חדש)`
              : `${linkTitle} (opens in new tab)`;
            
            return (
              <article key={link.id} className={styles.linkCard}>
                <div className={styles.linkHeader}>
                  <h3 className={styles.linkTitle}>{linkTitle}</h3>
                  <span className={styles.categoryBadge}>
                    {i18nService.translate(`links.categories.${link.category}`)}
                  </span>
                </div>
                
                <p className={styles.linkDescription}>{linkDescription}</p>
                
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitButton}
                  aria-label={ariaLabel}
                >
                  <span>{i18nService.translate('links.visit')}</span>
                  <svg 
                    className={styles.externalIcon}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path 
                      d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { externalLinks };
