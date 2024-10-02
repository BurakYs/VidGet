export {};

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'development' | 'production';
      LOG_IGNORE_IPS?: string;
    }
  }
}