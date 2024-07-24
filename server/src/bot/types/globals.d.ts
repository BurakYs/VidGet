export {};

declare global {
  interface String {
    change(replacements: Record<string, unknown>): string;
  }
}