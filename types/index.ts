export interface CustomError extends Error {
    status?: number;
    isJoi?: boolean;
}

export type RealTeam = {
    id: number;
    real_team_abbrev: string;
    strat_abbrev: string;
    bbref_abbrev: string;
};

export type RmlTeam= {
    [key: string]: number;
};
