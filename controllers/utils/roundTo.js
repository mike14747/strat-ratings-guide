const roundTo = (num, places) => {
    const x = Math.pow(10, places);
    return (Math.round(num * x) / x).toFixed(places);
};

module.exports = roundTo;
