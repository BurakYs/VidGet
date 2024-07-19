import scraperConfig from '@/config/scraper';

export default function calculateTTLSeconds(ttlDate?: number) {
  return ttlDate ? Math.floor((ttlDate - Date.now()) / 1000) : scraperConfig.standardCacheTTL;
}