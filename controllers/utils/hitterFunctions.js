const convertDefenseRangeError = (pos) => {
    return (`${pos.charAt(0)}e${parseInt(pos.slice(1, 3))}`);
};

const modifiedDefenseData = (hitterArray) => {
    return hitterArray.map(h => ({
        ...h,
        'h._CA': convertDefenseRangeError(h._CA),
        'h._1B': convertDefenseRangeError(h._1B),
        'h._2B': convertDefenseRangeError(h._2B),
        'h._3B': convertDefenseRangeError(h._3B),
        'h._SS': convertDefenseRangeError(h._SS),
        'h._LF': convertDefenseRangeError(h._LF),
        'h._CF': convertDefenseRangeError(h._CF),
        'h._RF': convertDefenseRangeError(h._RF),
    }));
};

const modifiedHitterData = (hitterArr) => {
    const modifiedHitterArray = hitterArr.filter(h => h.real_team_id !== 1).map(h => h);
    return modifiedHitterArray;
};

module.exports = {
    modifiedDefenseData,
    modifiedHitterData,
};
