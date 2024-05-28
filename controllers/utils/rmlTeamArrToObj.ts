type RmlTeam = {
    rml_team_name: string;
    id: number;
};

export function convertArrToObj(arr: RmlTeam[]) {
    const obj: Record<string, number> = {};

    arr.forEach((elem) => {
        obj[elem.rml_team_name] = elem.id;
    });

    return obj;
}
