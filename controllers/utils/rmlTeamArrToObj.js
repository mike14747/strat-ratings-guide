function convertArrToObj(arr) {
    const obj = {};

    arr.forEach((elem, i) => {
        obj[elem.rml_team_name] = elem.rml_team_id;
    });

    return obj;
}

module.exports = convertArrToObj;
