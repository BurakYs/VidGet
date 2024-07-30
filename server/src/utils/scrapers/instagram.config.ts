import scraperConfig from '@/config/scraper';

export default Object.freeze({
  commonHeaders: {
    'user-agent': scraperConfig.defaultUserAgent,
    'sec-gpc': '1',
    'sec-fetch-site': 'same-origin',
    'x-ig-app-id': '936619743392459'
  },
  mobileHeaders: {
    'x-ig-app-locale': 'en_US',
    'x-ig-device-locale': 'en_US',
    'x-ig-mapped-locale': 'en_US',
    'user-agent': 'Instagram 275.0.0.27.98 Android (33/13; 280dpi; 720x1423; Xiaomi; Redmi 7; onclite; qcom; en_US; 458229237)',
    'accept-language': 'en-US',
    'x-fb-http-engine': 'Liger',
    'x-fb-client-ip': 'True',
    'x-fb-server-cluster': 'True',
    'content-length': '0'
  }
});