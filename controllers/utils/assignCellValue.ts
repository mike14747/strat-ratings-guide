export function assignCellValue<T, K extends keyof T>(target: T, key: K, value: T[K]): void {
    target[key] = value;
}
