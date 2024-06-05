export function roundTo(num: number, places: number) {
    const x = Math.pow(10, places);
    return (Math.round(num * x) / x).toFixed(places);
}
