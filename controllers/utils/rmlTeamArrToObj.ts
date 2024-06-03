type RmlTeamObj = {
    rml_team_name: string;
    id: number;
};

type RmlTeamsInOneObj = {
    [key: string]: number;
}

export function convertArrToObj(arr: RmlTeamObj[]) {
    const obj: RmlTeamsInOneObj = {};

    arr.forEach((elem) => {
        obj[elem.rml_team_name] = elem.id;
    });

    return obj;
}
