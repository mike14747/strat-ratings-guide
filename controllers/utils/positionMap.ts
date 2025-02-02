type PositionStats = {
    on_bases: number;
    total_bases: number;
    dps: number;
};

const positionMap: Map<string, PositionStats> = new Map([
    ['CA-1e8', { on_bases: 50, total_bases: 120, dps: 5 }],
    ['1B-5e23', { on_bases: 80, total_bases: 200, dps: 10 }],
    ['2B-2e24', { on_bases: 60, total_bases: 150, dps: 7 }],
]);

export default positionMap;
