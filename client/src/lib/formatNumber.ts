export default function formatNumber(number: number) {
    return number.toLocaleString('en-US', {
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
    });
}