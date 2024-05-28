export function checkValidParam(param: number) {
    if (typeof param !== 'number' || param < 0 || param > 20) throw new Error('Ballpark rating param is invalid.');
}

export function bpHRAdjCalculate(bpHR: number) {
    checkValidParam(bpHR);
    return ((bpHR / 20) + 0.45) / 2;
}

export function bpSiAdjCalculate(bpSI: number) {
    checkValidParam(bpSI);
    return 5 * ((bpSI + 8) / 40) - 2;
}
