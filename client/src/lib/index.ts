export function formatNumber(number: number) {
    if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(1)}M`;
    } else if (number >= 1_000) {
        return `${(number / 1_000).toFixed(1)}K`;
    }

    return number;
}

export function dotNotation<T>(object: Record<string, any>, path: string) {
    const keys = path.split('.');
    let value = object

    for (const key of keys) {
        value = value[key];
    }

    return value as T;
}