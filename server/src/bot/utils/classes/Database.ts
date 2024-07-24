import fs from 'fs';

type DatabaseOptions = {
  path: string;
  cache?: boolean;
}

export default class Database {
  path: string;
  private cache: Record<string, unknown> | null;
  private fileRead: boolean;

  constructor(options: DatabaseOptions) {
    this.path = options.path;
    this.cache = options.cache ? {} : null;
    this.fileRead = false;
  }

  all() {
    if (this.cache && this.fileRead) return this.cache;
    if (this.cache && !this.fileRead && this.path) {
      this.fileRead = true;
      const data = fs.readFileSync(this.path, 'utf8');
      return this.cache = JSON.parse(data);
    }

    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (_error) {
      try {
        fs.writeFileSync(this.path, '{}');
        return {};
      } catch (_e) {
        const folderPath = this.path.substring(0, this.path.lastIndexOf('/'));
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(this.path, '{}');
        return {};
      }
    }
  }

  set<T>(key: string, value: T): T {
    const keys = key.split('.');
    let current = this.all();

    for (const key of keys.slice(0, -1)) {
      current[key] = current[key] || {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;

    if (!this.cache) {
      fs.writeFileSync(this.path, JSON.stringify(current, null, 4));
    } else {
      this.cache = current;
    }

    return value;
  }

  get(key: string) {
    const keys = key.split('.') || [];
    let current = this.all();

    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return null;
      }
    }

    return current;
  }

  push<T>(key: string, value: T): T {
    let currentValue = this.get(key);

    if (!Array.isArray(currentValue)) currentValue = [];

    currentValue.push(value);
    this.set(key, currentValue);

    return value;
  }

  delete(key: string) {
    this.set(key, undefined);
  }

  add(key: string, value: number): number {
    const currentValue = this.get(key);
    this.set(key, currentValue + value);

    return value;
  }

  subtract(key: string, value: number): number {
    const currentValue = this.get(key);
    this.set(key, currentValue - value);

    return value;
  }

  destroy() {
    this.cache = {};
    fs.writeFileSync(this.path, '{}');
  }
}