function checkValidParam(param) {
    if (typeof param !== 'number' || param < 0 || param > 20) throw new Error('Ballpark rating param is invalid.');
}

function bpHRAdjCalculate(bpHR) {
    checkValidParam(bpHR);
    return ((bpHR / 20) + 0.45) / 2;
}

function bpSiAdjCalculate(bpSI) {
    checkValidParam(bpSI);
    return 5 * ((bpSI + 8) / 40) - 2;
}

module.exports = {
    bpHRAdjCalculate,
    bpSiAdjCalculate,
};
