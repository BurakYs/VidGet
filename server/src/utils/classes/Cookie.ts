type CookieObject = Record<string, string>;

export default class Cookie {
  public cookies: CookieObject;

  constructor(data: string | CookieObject = {}) {
    this.cookies = typeof data === 'string' ? Cookie.fromString(data) : data;
    this.checkExpiration();
  }

  private checkExpiration() {
    const expirationValue = Object.entries(this.cookies).find(([key]) => key.toLowerCase().includes('expires'))?.[1];
    if (expirationValue && new Date(expirationValue).getTime() < Date.now()) {
      this.cookies = {};
    }
  }

  static fromString(str: string): CookieObject {
    return str.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=');
      cookies[name.trim()] = value?.trim() || '';
      return cookies;
    }, {} as CookieObject);
  }

  setCookies(cookies: string | string[]) {
    this.cookies = new Cookie(Array.isArray(cookies) ? cookies.join('; ') : cookies).cookies;
  }

  addMany(cookies: string | string[] | CookieObject) {
    this.cookies = { ...this.cookies, ...new Cookie(Array.isArray(cookies) ? cookies.join('; ') : cookies).cookies };
  }

  toString() {
    return Object.entries(this.cookies).map(([name, value]) => `${name}=${value}`).join('; ');
  }
}