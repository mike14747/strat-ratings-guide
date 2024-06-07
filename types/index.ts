export interface CustomError extends Error {
    status?: number,
    isJoi?: boolean,
}

export type RealTeam = {
    id: number,
    real_team_abbrev: string,
    strat_abbrev: string,
    bbref_abbrev: string,
}

export type RmlTeam = {
    [key: string]: number,
}

export type RmlTeamObj = {
    rml_team_name: string;
    id: number;
};

export type RmlTeamsInOneObj = {
    [key: string]: number;
}

export type CardedPlayer = {
    year: number,
    abbrev_name: string,
    full_name: string,
    rml_team: string,
    ip: number | null,
    ab: number | null,
}

export type HitterDataFromDB = {
    id: number,
    year: number,
    real_team: string,
    real_team_id: number,
    name: string,
    bats: string,
    injury: number | null,
    ab: number,
    so_v_l: number,
    bb_v_l: number,
    hit_v_l: string,
    ob_v_l: string,
    tb_v_l: string,
    hr_v_l: string,
    bp_hr_v_l: number,
    w_v_l: string,
    bp_si_v_l: number,
    cl_v_l: number,
    dp_v_l: number,
    so_v_r: number,
    bb_v_r: number,
    hit_v_r: string,
    ob_v_r: string,
    tb_v_r: string,
    hr_v_r: string,
    bp_hr_v_r: number,
    w_v_r: string,
    bp_si_v_r: number,
    cl_v_r: number,
    dp_v_r: number,
    stealing: string,
    stl: string,
    spd: number,
    bunt: string,
    h_r: string,
    d_ca: string,
    d_1b: string,
    d_2b: string,
    d_3b: string,
    d_ss: string,
    d_lf: string,
    d_cf: string,
    d_rf: string,
    fielding: string,
    rml_team_id: number | null,
    st_si_l: number,
    st_si_r: number,
    st_hr_l: number,
    st_hr_r: number,
    rml_team_name: string | null,
}

export type MultiTeamHitterDataFromDB = {
    real_team_id: number,
    hitter: string,
    ab: number,
    st_si_l: number,
    st_si_r: number,
    st_hr_l: number,
    st_hr_r: number,
}

export type PitcherDataFromDB = {
    id: number,
    year: number,
    real_team: string,
    real_team_id: number | null,
    name: string,
    throws: string,
    ip: number,
    so_v_l: number,
    bb_v_l: number,
    hit_v_l: string,
    ob_v_l: string,
    tb_v_l: string,
    hr_v_l: string,
    bp_hr_v_l: number,
    bp_si_v_l: number,
    dp_v_l: number,
    so_v_r: number,
    bb_v_r: number,
    hit_v_r: string,
    ob_v_r: string,
    tb_v_r: string,
    hr_v_r: string,
    bp_hr_v_r: number,
    bp_si_v_r: number,
    dp_v_r: number,
    hold: number,
    endurance: string,
    fielding: string,
    balk: number,
    wp: number,
    batting_b: string,
    stl: string,
    spd: number,
    rml_team_id: number | null,
    st_si_l: number,
    st_si_r: number,
    st_hr_l: number,
    st_hr_r: number,
    rml_team_name: string,
}

export type MultiTeamPitcherDataFromDB = {
    real_team_id: number,
    pitcher: string,
    ip: string,
    st_si_l: number,
    st_si_r: number,
    st_hr_l: number,
    st_hr_r: number,
}
