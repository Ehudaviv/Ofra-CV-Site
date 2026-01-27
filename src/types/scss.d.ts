/**
 * TypeScript declarations for SCSS modules
 * This allows importing .scss and .module.scss files in TypeScript
 */

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}
