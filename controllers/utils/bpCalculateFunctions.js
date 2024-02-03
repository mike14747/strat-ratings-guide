function bpHRAdjCalculate(bpHR) {
    return ((bpHR / 20) + 0.45) / 2;
}

function bpSiAdjCalculate(bpSI) {
    return 5 * ((bpSI + 8) / 40) - 2;
}

module.exports = {
    bpHRAdjCalculate,
    bpSiAdjCalculate,
};
