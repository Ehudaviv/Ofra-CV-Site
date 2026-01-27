# Implementation Plan: Portfolio Website

## Overview

This implementation plan breaks down the bilingual portfolio website into discrete coding tasks. The approach follows a bottom-up strategy: first establishing the foundation (project setup, i18n, theme), then building core components, and finally integrating everything together. Each task builds incrementally on previous work, with property-based tests placed close to implementation to catch errors early.

## Tasks

- [x] 1. Project setup and foundation
  - Initialize React + TypeScript + Vite project
  - Configure Sass/CSS Modules for styling
  - Set up testing framework (Vitest + React Testing Library)
  - Install fast-check for property-based testing
  - Create folder structure for components, services, assets, and locales
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Internationalization system
  - [x] 2.1 Implement I18nService class
    - Create I18nService with language switching, translation lookup, and direction detection
    - Set up translation file structure (he.json, en.json)
    - Implement language persistence in localStorage
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [x] 2.2 Write property test for language-direction mapping
    - **Property 1: Language-Direction Mapping**
    - **Validates: Requirements 1.4, 1.5**
  
  - [x] 2.3 Write unit tests for I18nService
    - Test language switching
    - Test translation lookup with fallbacks
    - Test localStorage persistence
    - _Requirements: 6.1, 6.5_

- [ ] 3. Theme configuration and styling foundation
  - [x] 3.1 Create Yemenite-inspired theme configuration
    - Define color palette (warm terracotta, deep blue, gold, cream)
    - Define typography (heading, body, Hebrew fonts)
    - Define spacing and breakpoints
    - Create CSS custom properties for theme values
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 3.2 Write property test for typography consistency
    - **Property 7: Typography Consistency**
    - **Validates: Requirements 7.3**
  
  - [x] 3.3 Write property test for color contrast accessibility
    - **Property 8: Color Contrast Accessibility**
    - **Validates: Requirements 7.5**
  
  - [x] 3.4 Create responsive layout utilities
    - Implement breakpoint mixins for Sass
    - Create container and grid utilities
    - Set up RTL/LTR directional styles
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 3.5 Write property test for responsive layout adaptation
    - **Property 9: Responsive Layout Adaptation**
    - **Validates: Requirements 8.1**

- [x] 4. Core UI components
  - [x] 4.1 Implement LanguageSwitcher component
    - Create toggle button for Hebrew/English
    - Connect to I18nService
    - Style with theme colors
    - _Requirements: 6.1_
  
  - [x] 4.2 Write unit tests for LanguageSwitcher
    - Test toggle functionality
    - Test visual state changes
    - _Requirements: 6.1_
  
  - [x] 4.3 Implement Navigation component
    - Create navigation links for all sections
    - Implement active section highlighting
    - Add keyboard navigation support
    - Make responsive (mobile hamburger menu)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 4.4 Write property test for navigation link functionality
    - **Property 10: Navigation Link Functionality**
    - **Validates: Requirements 9.2**
  
  - [x] 4.5 Write unit tests for Navigation component
    - Test all navigation links render
    - Test active state indicator
    - Test keyboard navigation
    - Test mobile responsive behavior
    - _Requirements: 9.1, 9.3, 9.4, 9.5, 8.2_

- [x] 5. Content management service
  - [x] 5.1 Implement ContentManager service
    - Create methods to load articles from מאמרים folder
    - Create methods to load exhibition images from תמונות folder
    - Create methods to load student artwork from ציורים בהנחייתי folder
    - Implement image optimization (thumbnail generation)
    - Add error handling for failed loads
    - _Requirements: 2.1, 3.1, 4.1, 10.4_
  
  - [x] 5.2 Write unit tests for ContentManager
    - Test article loading returns 4 articles
    - Test exhibition images loading returns 15 images
    - Test student artwork loading returns 16 images
    - Test error handling for missing files
    - _Requirements: 2.1, 3.1, 4.1_

- [x] 6. About section
  - [x] 6.1 Implement AboutSection component
    - Create layout with photo placeholder and biography text area
    - Connect to I18nService for translations
    - Apply RTL/LTR styling based on language
    - Style with Yemenite theme
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 6.2 Write unit tests for AboutSection
    - Test photo placeholder renders
    - Test biography text area renders
    - Test empty biography state
    - _Requirements: 1.1, 1.2_

- [x] 7. Document viewer
  - [x] 7.1 Implement DocumentViewer component
    - Integrate PDF.js for PDF rendering
    - Integrate Mammoth.js for DOCX conversion
    - Create modal/overlay UI for document display
    - Add close button and error handling
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [x] 7.2 Write property test for article click opens viewer
    - **Property 3: Article Click Opens Viewer**
    - **Validates: Requirements 2.3**
  
  - [x] 7.3 Write unit tests for DocumentViewer
    - Test PDF document opens
    - Test DOCX document opens
    - Test error state display
    - Test close button functionality
    - _Requirements: 2.4, 2.5_

- [x] 8. Articles section
  - [x] 8.1 Implement ArticlesSection component
    - Load articles using ContentManager
    - Display article list with titles
    - Handle article click to open DocumentViewer
    - Connect to I18nService for article title translations
    - _Requirements: 2.1, 2.2, 2.3, 2.6_
  
  - [x] 8.2 Write unit tests for ArticlesSection
    - Test article list displays
    - Test article titles in both languages
    - _Requirements: 2.2, 2.6_

- [x] 9. Gallery component
  - [x] 9.1 Implement Gallery component
    - Create grid layout for thumbnails
    - Implement lightbox for full-size image viewing
    - Add next/previous navigation controls
    - Add keyboard navigation (arrow keys, ESC)
    - Display captions with i18n support
    - Add loading placeholders
    - Add error fallback placeholders
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 10.1, 10.2, 10.3_
  
  - [x] 9.2 Write property test for gallery thumbnail interaction
    - **Property 4: Gallery Thumbnail Interaction**
    - **Validates: Requirements 3.3, 4.3**
  
  - [x] 9.3 Write property test for image loading placeholders
    - **Property 11: Image Loading Placeholders**
    - **Validates: Requirements 10.2**
  
  - [x] 9.4 Write unit tests for Gallery component
    - Test grid layout structure
    - Test navigation controls exist
    - Test keyboard navigation
    - Test placeholder displays during load
    - Test fallback placeholder on error
    - _Requirements: 3.2, 3.4, 10.2, 10.3_

- [x] 10. Checkpoint - Ensure core components work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Exhibitions section
  - [x] 11.1 Implement ExhibitionsSection component
    - Load 15 exhibition images using ContentManager
    - Render Gallery component with exhibition images
    - Connect captions to I18nService
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 11.2 Write unit tests for ExhibitionsSection
    - Test exactly 15 images load
    - Test gallery renders with images
    - _Requirements: 3.1_

- [x] 12. Student artwork section
  - [x] 12.1 Implement StudentArtworkSection component
    - Load 16 student artwork images using ContentManager
    - Render Gallery component with student artwork
    - Connect descriptions to I18nService
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 12.2 Write unit tests for StudentArtworkSection
    - Test exactly 16 images load
    - Test gallery renders with images
    - _Requirements: 4.1_

- [x] 13. External links section
  - [x] 13.1 Implement ExternalLinks component
    - Create list of 11 external links with URLs
    - Set target="_blank" and rel="noopener noreferrer" on links
    - Add proper ARIA labels for accessibility
    - Connect link titles to I18nService
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 13.2 Write property test for external links target behavior
    - **Property 5: External Links Target Behavior**
    - **Validates: Requirements 5.2**
  
  - [x] 13.3 Write unit tests for ExternalLinks
    - Test exactly 11 links render
    - Test links have target="_blank"
    - Test links have proper ARIA labels
    - Test link titles in both languages
    - _Requirements: 5.1, 5.2, 5.4, 5.3_

- [x] 14. Main App component integration
  - [x] 14.1 Implement App component
    - Set up global state for language and current section
    - Render LanguageSwitcher in header
    - Render Navigation component
    - Render all section components (About, Articles, Exhibitions, StudentArtwork, ExternalLinks)
    - Apply theme and directional styling based on language
    - Implement smooth scrolling between sections
    - _Requirements: 6.2, 6.3, 6.4, 9.2_
  
  - [x] 14.2 Write property test for content language consistency
    - **Property 2: Content Language Consistency**
    - **Validates: Requirements 1.3, 2.6, 3.5, 5.3**
  
  - [x] 14.3 Write property test for language change propagation
    - **Property 6: Language Change Propagation**
    - **Validates: Requirements 6.4**
  
  - [x] 14.4 Write integration tests for App component
    - Test language switching updates all sections
    - Test navigation between sections
    - Test RTL layout for Hebrew
    - Test LTR layout for English
    - _Requirements: 6.2, 6.3, 6.4, 9.2_

- [x] 15. Translation content
  - [x] 15.1 Create Hebrew translation file (he.json)
    - Add navigation labels
    - Add About section content
    - Add article titles (4 articles)
    - Add exhibition captions (15 images)
    - Add student artwork descriptions (16 images)
    - Add external link titles (11 links)
    - Add error messages
    - _Requirements: 1.3, 2.6, 3.5, 4.5, 5.3_
  
  - [x] 15.2 Create English translation file (en.json)
    - Add navigation labels
    - Add About section content
    - Add article titles (4 articles)
    - Add exhibition captions (15 images)
    - Add student artwork descriptions (16 images)
    - Add external link titles (11 links)
    - Add error messages
    - _Requirements: 1.3, 2.6, 3.5, 4.5, 5.3_

- [x] 16. Content loading and optimization
  - [x] 16.1 Implement progressive image loading
    - Add lazy loading for gallery images
    - Implement intersection observer for viewport detection
    - _Requirements: 10.1_
  
  - [x] 16.2 Implement content caching
    - Add service worker for caching static assets
    - Configure cache strategies for images and documents
    - _Requirements: 10.5_
  
  - [x] 16.3 Write unit tests for content loading
    - Test progressive loading implementation
    - Test caching behavior
    - _Requirements: 10.1, 10.5_

- [x] 17. Accessibility enhancements
  - [x] 17.1 Add ARIA labels and semantic HTML
    - Ensure all interactive elements have proper ARIA labels
    - Use semantic HTML5 elements (nav, main, section, article)
    - Add skip-to-content link
    - _Requirements: 5.4, 9.5_
  
  - [x] 17.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Test tab order is logical
    - _Requirements: 9.5_
  
  - [x] 17.3 Run accessibility audit
    - Use axe-core to check for violations
    - Verify WCAG AA compliance
    - Test with screen reader
    - _Requirements: 7.5, 5.4, 9.5_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Build and deployment preparation
  - [x] 19.1 Configure production build
    - Optimize bundle size with code splitting
    - Configure asset optimization (image compression, minification)
    - Set up environment variables for production
    - _Requirements: 10.4_
  
  - [x] 19.2 Create deployment documentation
    - Document build process
    - Document environment setup
    - Document content update process (how to add new articles/images)
    - _Requirements: All requirements_

## Notes

- All tasks are required for comprehensive implementation with full test coverage
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript + React + Vite for modern web development
- Yemenite art theme uses warm colors (terracotta, gold, cream) with traditional design elements
- All content is bilingual with proper RTL/LTR support
