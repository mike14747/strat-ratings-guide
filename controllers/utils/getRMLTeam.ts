export default function getRmlTeam(lookup: Map<string, string>, year: number, name: string, usageValue: number): string | null {
    const key = `${year}-${name.toLowerCase()}-${usageValue}`;
    return lookup.get(key) || null;
}
