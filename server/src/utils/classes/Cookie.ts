type CookieObject = Record<string, string>;

export default class Cookie {
  public cookies: CookieObject;

  constructor(data: string | CookieObject = {}) {
    if (typeof data === 'string') {
      this.cookies = Cookie.fromString(data);
    } else {
      this.cookies = data;
    }

    const expirationCookieValue = Object.entries(this.cookies).find(([key]) => key.toLowerCase().includes('expires'))?.[1];
    if (expirationCookieValue) {
      const expirationDate = new Date(expirationCookieValue);
      if (expirationDate.getTime() < Date.now()) {
        this.cookies = {};
      }
    }
  }

  static fromString(str: string) {
    return str.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=');
      cookies[name.trim()] = value?.trim() || '';
      return cookies;
    }, {} as CookieObject);
  }

  setCookies(cookies: string | string[]) {
    if (Array.isArray(cookies)) cookies = cookies.join('; ');
    this.cookies = { ...this.cookies, ...new Cookie(cookies).cookies };
  }

  addMany(cookies: string | string[] | CookieObject) {
    if (Array.isArray(cookies)) cookies = cookies.join('; ');

    const newCookies = new Cookie(cookies).cookies;
    this.cookies = { ...this.cookies, ...newCookies };
  }

  toString() {
    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}