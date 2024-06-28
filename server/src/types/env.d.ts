export {};

declare global {
  // biome-ignore lint/style/noNamespace: Will change when I find how to fix it
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'development' | 'production';
      LOG_IGNORE_IPS?: string;
    }
  }
}
