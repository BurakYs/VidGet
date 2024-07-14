type CookieObject = Record<string, string>;

export default class Cookie {
  private cookies: CookieObject;

  constructor(data: string | CookieObject = {}) {
    if (typeof data === 'string') {
      this.cookies = Cookie.fromString(data);
    } else {
      this.cookies = data;
    }
  }

  static fromString(str: string) {
    return str.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=');
      cookies[name.trim()] = value?.trim() || '';
      return cookies;
    }, {} as CookieObject);
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