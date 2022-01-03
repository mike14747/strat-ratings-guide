const bpHRAdjCalculate = (bpHR) => ((bpHR / 20) + 0.45) / 2;
const bpSiAdjCalculate = (bpSI) => 5 * ((bpSI + 8) / 40) - 2;

module.exports = {
    bpHRAdjCalculate,
    bpSiAdjCalculate,
};
