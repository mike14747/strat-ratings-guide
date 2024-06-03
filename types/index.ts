export interface CustomError extends Error {
    status?: number,
    isJoi?: boolean,
}

export type RealTeam = {
    id: number,
    real_team_abbrev: string,
    strat_abbrev: string,
    bbref_abbrev: string,
};

export type RmlTeam= {
    [key: string]: number,
};

export type CardedPlayer = {
    year: number,
    abbrev_name: string,
    full_name: string,
    rml_team: string,
    ip: number | null,
    ab: number | null,
};
