type RmlTeam = {
    rml_team_name: string;
    id: number;
};

type RmlTeamObj = {
    [key: string]: number;
}

export function convertArrToObj(arr: RmlTeam[]) {
    const obj: RmlTeamObj = {};

    arr.forEach((elem) => {
        obj[elem.rml_team_name] = elem.id;
    });

    return obj;
}
