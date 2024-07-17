import app from '@/config/app';

export default function calculateTTLSeconds(ttlDate?: number) {
  return ttlDate ? Math.floor((ttlDate - Date.now()) / 1000) : app.standardCacheTTL;
}