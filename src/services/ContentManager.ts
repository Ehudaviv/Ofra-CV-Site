/**
 * ContentManager - Service for loading and managing content from file system
 * Handles articles, exhibition images, and student artwork
 */

export interface Article {
  id: string;
  filename: string;
  titleKey: string;
  fileType: 'pdf' | 'docx';
  filePath: string;
  dateAdded?: Date;
}

export interface GalleryImage {
  id: string;
  filename: string;
  thumbnailUrl: string;
  fullUrl: string;
  captionKey: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ContentManagerConfig {
  articlesPath: string;
  exhibitionsPath: string;
  studentArtPath: string;
}

const DEFAULT_CONFIG: ContentManagerConfig = {
  articlesPath: `${import.meta.env.BASE_URL}מאמרים`,
  exhibitionsPath: `${import.meta.env.BASE_URL}תמונות`,
  studentArtPath: `${import.meta.env.BASE_URL}ציורים בהנחייתי`
};

export class ContentManager {
  private config: ContentManagerConfig;
  private articlesCache: Article[] | null = null;
  private exhibitionsCache: GalleryImage[] | null = null;
  private studentArtCache: GalleryImage[] | null = null;

  constructor(config: Partial<ContentManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Load articles from the מאמרים folder
   */
  async loadArticles(): Promise<Article[]> {
    if (this.articlesCache) {
      return this.articlesCache;
    }

    try {
      // In a real implementation, this would fetch from an API or file system
      // For now, we'll use the known article files
      const articles: Article[] = [
        {
          id: 'article-1',
          filename: 'Afya. Z f.docx',
          titleKey: 'articles.afya',
          fileType: 'docx',
          filePath: `${this.config.articlesPath}/Afya. Z f.docx`
        },
        {
          id: 'article-3',
          filename: 'Religious Art in the Postmodern Era- From Exclusion to Acceptance.pdf',
          titleKey: 'articles.religiousArt',
          fileType: 'pdf',
          filePath: `${this.config.articlesPath}/Religious Art in the Postmodern Era- From Exclusion to Acceptance.pdf`
        },
        {
          id: 'article-4',
          filename: 'תהודה 44- עופרה סרי-רומיה דיוקן תימני.png.pdf',
          titleKey: 'articles.yemenitePortrait',
          fileType: 'pdf',
          filePath: `${this.config.articlesPath}/תהודה 44- עופרה סרי-רומיה דיוקן תימני.png.pdf`
        },
        {
          id: 'article-2',
          filename: 'Analysis of Palestinian Art-2.docx',
          titleKey: 'articles.palestinianArt',
          fileType: 'docx',
          filePath: `${this.config.articlesPath}/Analysis of Palestinian Art-2.docx`
        }
      ];

      this.articlesCache = articles;
      return articles;
    } catch (error) {
      console.error('Failed to load articles:', error);
      throw new Error('Unable to load articles. Please try again later.');
    }
  }

  /**
   * Load exhibition images from the תמונות folder
   */
  async loadExhibitionImages(): Promise<GalleryImage[]> {
    if (this.exhibitionsCache) {
      return this.exhibitionsCache;
    }

    try {
      const images: GalleryImage[] = [
        {
          id: 'exhibit-1',
          filename: 'separation and integration between soul religion and art.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/separation and integration between soul religion and art.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/separation and integration between soul religion and art.jpeg`,
          captionKey: 'exhibitions.separationIntegration',
          alt: 'Separation and integration between soul religion and art'
        },
        {
          id: 'exhibit-2',
          filename: 'אגדת צבע - בבאזל חלמתי חלום - תערוכה שהייתי האוצרת בה.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/אגדת צבע - בבאזל חלמתי חלום - תערוכה שהייתי האוצרת בה.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/אגדת צבע - בבאזל חלמתי חלום - תערוכה שהייתי האוצרת בה.jpeg`,
          captionKey: 'exhibitions.colorLegend',
          alt: 'אגדת צבע - בבאזל חלמתי חלום'
        },
        {
          id: 'exhibit-3',
          filename: 'אום סוביאן - אם כל השדות - תערוכה שהייתי האוצרות בה.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/אום סוביאן - אם כל השדות - תערוכה שהייתי האוצרות בה.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/אום סוביאן - אם כל השדות - תערוכה שהייתי האוצרות בה.jpeg`,
          captionKey: 'exhibitions.umSobyan',
          alt: 'אום סוביאן - אם כל השדות'
        },
        {
          id: 'exhibit-4',
          filename: 'אני בהרצאה.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/אני בהרצאה.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/אני בהרצאה.jpeg`,
          captionKey: 'exhibitions.lecture',
          alt: 'אני בהרצאה'
        },
        {
          id: 'exhibit-5',
          filename: 'הצגת תערוכת יש לי משהו להגיד לכם בבית משפט השלום בירושלים.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/הצגת תערוכת יש לי משהו להגיד לכם בבית משפט השלום בירושלים.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/הצגת תערוכת יש לי משהו להגיד לכם בבית משפט השלום בירושלים.jpeg`,
          captionKey: 'exhibitions.courtExhibition',
          alt: 'הצגת תערוכת יש לי משהו להגיד לכם'
        },
        {
          id: 'exhibit-6',
          filename: 'יום העיון השנתי לזכר נגה ראובני - מייסד נאות קדומים.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/יום העיון השנתי לזכר נגה ראובני - מייסד נאות קדומים.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/יום העיון השנתי לזכר נגה ראובני - מייסד נאות קדומים.jpeg`,
          captionKey: 'exhibitions.reuvenMemorial',
          alt: 'יום העיון השנתי לזכר נגה ראובני'
        },
        {
          id: 'exhibit-7',
          filename: 'יש לי משהו להגיד לכם - ילדים מביעים את אשר ליבם בעקבות מלחמת חרבות ברזל.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/יש לי משהו להגיד לכם - ילדים מביעים את אשר ליבם בעקבות מלחמת חרבות ברזל.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/יש לי משהו להגיד לכם - ילדים מביעים את אשר ליבם בעקבות מלחמת חרבות ברזל.jpeg`,
          captionKey: 'exhibitions.childrenVoices',
          alt: 'יש לי משהו להגיד לכם - ילדים מביעים את אשר ליבם'
        },
        {
          id: 'exhibit-8',
          filename: 'כנס סקר אמנות הקיר בישראל.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/כנס סקר אמנות הקיר בישראל.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/כנס סקר אמנות הקיר בישראל.jpeg`,
          captionKey: 'exhibitions.wallArtConference',
          alt: 'כנס סקר אמנות הקיר בישראל'
        },
        {
          id: 'exhibit-9',
          filename: 'מעגלי הלב - חגיגה נשית לשנה החדשה.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/מעגלי הלב - חגיגה נשית לשנה החדשה.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/מעגלי הלב - חגיגה נשית לשנה החדשה.jpeg`,
          captionKey: 'exhibitions.heartCircles',
          alt: 'מעגלי הלב - חגיגה נשית לשנה החדשה'
        },
        {
          id: 'exhibit-10',
          filename: 'נשים ומגדר באמנויות בישראל - ימי עיון באוניברסיטת חיפה בהשתתפותי.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/נשים ומגדר באמנויות בישראל - ימי עיון באוניברסיטת חיפה בהשתתפותי.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/נשים ומגדר באמנויות בישראל - ימי עיון באוניברסיטת חיפה בהשתתפותי.jpeg`,
          captionKey: 'exhibitions.womenGender',
          alt: 'נשים ומגדר באמנויות בישראל'
        },
        {
          id: 'exhibit-11',
          filename: 'תערוכת אומנות בהשתתפות יוצרי המושב בהובלתי.jpeg',
          thumbnailUrl: `${this.config.exhibitionsPath}/תערוכת אומנות בהשתתפות יוצרי המושב בהובלתי.jpeg`,
          fullUrl: `${this.config.exhibitionsPath}/תערוכת אומנות בהשתתפות יוצרי המושב בהובלתי.jpeg`,
          captionKey: 'exhibitions.moshavExhibition',
          alt: 'תערוכת אומנות בהשתתפות יוצרי המושב'
        }
      ];

      this.exhibitionsCache = images;
      return images;
    } catch (error) {
      console.error('Failed to load exhibition images:', error);
      throw new Error('Unable to load exhibition images. Please try again later.');
    }
  }

  /**
   * Load student artwork images from the ציורים בהנחייתי folder
   */
  async loadStudentArtImages(): Promise<GalleryImage[]> {
    if (this.studentArtCache) {
      return this.studentArtCache;
    }

    try {
      const images: GalleryImage[] = [
        {
          id: 'student-1',
          filename: 'יצירת אומנות בהנחייתי.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/יצירת אומנות בהנחייתי.jpeg`,
          fullUrl: `${this.config.studentArtPath}/יצירת אומנות בהנחייתי.jpeg`,
          captionKey: 'studentArt.artworkUnderGuidance',
          alt: 'יצירת אומנות בהנחייתי'
        },
        {
          id: 'student-2',
          filename: 'צבר ישראלי בתערוכה.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/צבר ישראלי בתערוכה.jpeg`,
          fullUrl: `${this.config.studentArtPath}/צבר ישראלי בתערוכה.jpeg`,
          captionKey: 'studentArt.israeliSabra',
          alt: 'צבר ישראלי בתערוכה'
        },
        {
          id: 'student-3',
          filename: 'ציור אחדות שצוייר על ידי תלמידים.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור אחדות שצוייר על ידי תלמידים.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור אחדות שצוייר על ידי תלמידים.jpeg`,
          captionKey: 'studentArt.unityPainting',
          alt: 'ציור אחדות שצוייר על ידי תלמידים'
        },
        {
          id: 'student-4',
          filename: 'ציור אישה תימנייה על ידי תלמידים.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור אישה תימנייה על ידי תלמידים.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור אישה תימנייה על ידי תלמידים.jpeg`,
          captionKey: 'studentArt.yemeniteWoman',
          alt: 'ציור אישה תימנייה על ידי תלמידים'
        },
        {
          id: 'student-5',
          filename: 'ציור חייל בצבא ההגנה לישראל.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור חייל בצבא ההגנה לישראל.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור חייל בצבא ההגנה לישראל.jpeg`,
          captionKey: 'studentArt.idfSoldier',
          alt: 'ציור חייל בצבא ההגנה לישראל'
        },
        {
          id: 'student-6',
          filename: 'ציור רימונים שצוייר על ידי תלמידה.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור רימונים שצוייר על ידי תלמידה.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור רימונים שצוייר על ידי תלמידה.jpeg`,
          captionKey: 'studentArt.pomegranates',
          alt: 'ציור רימונים שצוייר על ידי תלמידה'
        },
        {
          id: 'student-7',
          filename: 'ציור שצוייר על ידי תלמיד.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור שצוייר על ידי תלמיד.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור שצוייר על ידי תלמיד.jpeg`,
          captionKey: 'studentArt.studentPainting',
          alt: 'ציור שצוייר על ידי תלמיד'
        },
        {
          id: 'student-8',
          filename: 'ציור תלמידים 1.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור תלמידים 1.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור תלמידים 1.jpeg`,
          captionKey: 'studentArt.studentsPainting1',
          alt: 'ציור תלמידים 1'
        },
        {
          id: 'student-9',
          filename: 'ציור תלמידים 2.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור תלמידים 2.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור תלמידים 2.jpeg`,
          captionKey: 'studentArt.studentsPainting2',
          alt: 'ציור תלמידים 2'
        },
        {
          id: 'student-10',
          filename: 'ציור תלמידים 3.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/ציור תלמידים 3.jpeg`,
          fullUrl: `${this.config.studentArtPath}/ציור תלמידים 3.jpeg`,
          captionKey: 'studentArt.studentsPainting3',
          alt: 'ציור תלמידים 3'
        },
        {
          id: 'student-11',
          filename: 'תלמיד בשיעור.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/תלמיד בשיעור.jpeg`,
          fullUrl: `${this.config.studentArtPath}/תלמיד בשיעור.jpeg`,
          captionKey: 'studentArt.studentInClass',
          alt: 'תלמיד בשיעור'
        },
        {
          id: 'student-12',
          filename: 'תלמידה בשיעור מייצרת דיוקן תימני.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/תלמידה בשיעור מייצרת דיוקן תימני.jpeg`,
          fullUrl: `${this.config.studentArtPath}/תלמידה בשיעור מייצרת דיוקן תימני.jpeg`,
          captionKey: 'studentArt.studentCreatingPortrait',
          alt: 'תלמידה בשיעור מייצרת דיוקן תימני'
        },
        {
          id: 'student-13',
          filename: 'תלמידות בשיעור מייצרות אישה תימנייה.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/תלמידות בשיעור מייצרות אישה תימנייה.jpeg`,
          fullUrl: `${this.config.studentArtPath}/תלמידות בשיעור מייצרות אישה תימנייה.jpeg`,
          captionKey: 'studentArt.studentsCreatingWoman',
          alt: 'תלמידות בשיעור מייצרות אישה תימנייה'
        },
        {
          id: 'student-14',
          filename: 'תלמידות בשיעור.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/תלמידות בשיעור.jpeg`,
          fullUrl: `${this.config.studentArtPath}/תלמידות בשיעור.jpeg`,
          captionKey: 'studentArt.studentsInClass1',
          alt: 'תלמידות בשיעור'
        },
        {
          id: 'student-15',
          filename: 'תלמידות שלי בשיעור.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/תלמידות שלי בשיעור.jpeg`,
          fullUrl: `${this.config.studentArtPath}/תלמידות שלי בשיעור.jpeg`,
          captionKey: 'studentArt.myStudentsInClass',
          alt: 'תלמידות שלי בשיעור'
        },
        {
          id: 'student-16',
          filename: 'תלמידים בשיעור.jpeg',
          thumbnailUrl: `${this.config.studentArtPath}/תלמידים בשיעור.jpeg`,
          fullUrl: `${this.config.studentArtPath}/תלמידים בשיעור.jpeg`,
          captionKey: 'studentArt.studentsInClass2',
          alt: 'תלמידים בשיעור'
        }
      ];

      this.studentArtCache = images;
      return images;
    } catch (error) {
      console.error('Failed to load student artwork images:', error);
      throw new Error('Unable to load student artwork images. Please try again later.');
    }
  }

  /**
   * Optimize image for web delivery
   * In a real implementation, this would generate thumbnails and optimize file sizes
   * For now, it returns the original URL
   */
  async optimizeImage(imagePath: string, size: 'thumbnail' | 'full'): Promise<string> {
    // In production, this would:
    // 1. Check if optimized version exists in cache
    // 2. If not, generate thumbnail/optimized version
    // 3. Store in cache
    // 4. Return optimized URL
    
    // For now, return the original path
    return imagePath;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.articlesCache = null;
    this.exhibitionsCache = null;
    this.studentArtCache = null;
  }
}

// Singleton instance
let instance: ContentManager | null = null;

export function getContentManager(): ContentManager {
  if (!instance) {
    instance = new ContentManager();
  }
  return instance;
}
