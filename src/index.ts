// Reexport the native module. On web, it will be resolved to BgSecureModule.web.ts
// and on native platforms to BgSecureModule.ts
export { default } from './BgSecureModule';
export * from './BgSecure.types';
