export default function dotNotation<T>(object: Record<string, any>, path: string) {
    const keys = path.split('.');
    let value = object;

    for (const key of keys) {
        value = value[key];
    }

    return value as T;
}