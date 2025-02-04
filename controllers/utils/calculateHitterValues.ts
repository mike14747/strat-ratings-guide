import { OB_VALUE, TB_VALUE, CLUTCH_ADJUST_VALUE } from './constants';
import { bpHRAdjCalculate, bpSiAdjCalculate } from './bpCalculateFunctions';
import { roundTo } from './roundTo';
import { fieldingWopsCalculate } from './fieldingWopsCalculate';
import type { HitterDataFromDB, MultiTeamHitterDataFromDB, Positions, DefRating } from '../../types/index';

function processWColumn(w: string, bpsi: number) {
    let wCol = '';

    if (w === 'w') wCol += 'w';
    if (bpsi === 0) wCol += '*';

    return wCol;
}

function wOPSCalculate(ob: number, tb: number, dp: number, wAdj: number) {
    return ((OB_VALUE * ob) + (TB_VALUE * tb) - (OB_VALUE * 20 * dp / 108)) - wAdj;
}

function ballparkCalculations(hitter: HitterDataFromDB) {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let clAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;
    let clAdjVsR = 0;

    // ballpark calculations vs Lefty pitchers
    if (hitter.bats === 'L') {
        bpAdjVsL = bpHRAdjCalculate(hitter.st_hr_l);
        bpSiAdjVsL = bpSiAdjCalculate(hitter.st_si_l);
        clAdjVsL = CLUTCH_ADJUST_VALUE * hitter.cl_v_l;
    } else if (hitter.bats === 'R' || hitter.bats === 'S') {
        bpAdjVsL = bpHRAdjCalculate(hitter.st_hr_r);
        bpSiAdjVsL = bpSiAdjCalculate(hitter.st_si_r);
        clAdjVsL = CLUTCH_ADJUST_VALUE * hitter.cl_v_l;
    }
    if (hitter.bp_si_v_l === 0) {
        bpSiAdjVsL = 0;
        clAdjVsL = 0;
    }
    const bpSiVsL = clAdjVsL + bpSiAdjVsL;
    const bpHrVsL = bpAdjVsL * hitter.bp_hr_v_l;
    const bpHitVsL = bpHrVsL + hitter.bp_si_v_l;
    const bpTbVsL = (4 * bpHrVsL) + hitter.bp_si_v_l;

    // ballpark calculations vs Righty pitchers
    if (hitter.bats === 'L' || hitter.bats === 'S') {
        bpAdjVsR = bpHRAdjCalculate(hitter.st_hr_l);
        bpSiAdjVsR = bpSiAdjCalculate(hitter.st_si_l);
        clAdjVsR = CLUTCH_ADJUST_VALUE * hitter.cl_v_r;
    } else if (hitter.bats === 'R') {
        bpAdjVsR = bpHRAdjCalculate(hitter.st_hr_r);
        bpSiAdjVsR = bpSiAdjCalculate(hitter.st_si_r);
        clAdjVsR = CLUTCH_ADJUST_VALUE * hitter.cl_v_r;
    }
    if (hitter.bp_si_v_r === 0) {
        bpSiAdjVsR = 0;
        clAdjVsR = 0;
    }
    const bpSiVsR = clAdjVsR + bpSiAdjVsR;
    const bpHrVsR = bpAdjVsR * hitter.bp_hr_v_r;
    const bpHitVsR = bpHrVsR + hitter.bp_si_v_r;
    const bpTbVsR = (4 * bpHrVsR) + hitter.bp_si_v_r;
    // end ballpark calculations

    const obVsL = parseFloat(hitter.ob_v_l) + bpHitVsL + bpSiVsL;
    const tbVsL = parseFloat(hitter.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(hitter.ob_v_r) + bpHitVsR + bpSiVsR;
    const tbVsR = parseFloat(hitter.tb_v_r) + bpTbVsR + bpSiVsR;

    // start wOPS calculations
    const wAdjVsL = hitter.w_v_l === 'w' ? TB_VALUE * 9 : 0;
    const wopsVsL = wOPSCalculate(obVsL, tbVsL, hitter.dp_v_l, wAdjVsL);
    const wAdjVsR = hitter.w_v_r === 'w' ? TB_VALUE * 9 : 0;
    const wopsVsR = wOPSCalculate(obVsR, tbVsR, hitter.dp_v_r, wAdjVsR);

    return {
        hit_v_l: roundTo(parseFloat(hitter.hit_v_l) + bpHitVsL + bpSiVsL, 1),
        ob_v_l: roundTo(obVsL, 1),
        tb_v_l: roundTo(tbVsL, 1),
        hr_v_l: roundTo(parseFloat(hitter.hr_v_l) + bpHrVsL, 1),
        hit_v_r: roundTo(parseFloat(hitter.hit_v_r) + bpHitVsR + bpSiVsR, 1),
        ob_v_r: roundTo(obVsR, 1),
        tb_v_r: roundTo(tbVsR, 1),
        hr_v_r: roundTo(parseFloat(hitter.hr_v_r) + bpHrVsR, 1),
        wopsVsL,
        wopsVsR,
    };
}

function multiBallparkCalculations(hitter: HitterDataFromDB, partials: MultiTeamHitterDataFromDB[]) {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let clAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;
    let clAdjVsR = 0;

    let bpSiVsL = 0;
    let bpHrVsL = 0;
    let bpHitVsL = 0;
    let bpTbVsL = 0;
    let tempbpHrVsL = 0;
    let tempbpHitVsL = 0;

    let bpSiVsR = 0;
    let bpHrVsR = 0;
    let bpHitVsR = 0;
    let bpTbVsR = 0;
    let tempbpHrVsR = 0;
    let tempbpHitVsR = 0;

    partials.forEach(t => {
        // ballpark calculations vs Lefty pitchers
        if (hitter.bats === 'L') {
            bpAdjVsL = bpHRAdjCalculate(t.st_hr_l);
            bpSiAdjVsL = bpSiAdjCalculate(t.st_si_l);
            clAdjVsL = CLUTCH_ADJUST_VALUE * hitter.cl_v_l;
        } else if (hitter.bats === 'R' || hitter.bats === 'S') {
            bpAdjVsL = bpHRAdjCalculate(t.st_hr_r);
            bpSiAdjVsL = bpSiAdjCalculate(t.st_si_r);
            clAdjVsL = CLUTCH_ADJUST_VALUE * hitter.cl_v_l;
        }
        if (hitter.bp_si_v_l === 0) {
            bpSiAdjVsL = 0;
            clAdjVsL = 0;
        }
        bpSiVsL += (clAdjVsL + bpSiAdjVsL) * t.ab / hitter.ab;
        tempbpHrVsL = bpAdjVsL * hitter.bp_hr_v_l * t.ab / hitter.ab;
        bpHrVsL += tempbpHrVsL;
        tempbpHitVsL = hitter.bp_si_v_l * t.ab / hitter.ab;
        bpHitVsL += tempbpHrVsL + tempbpHitVsL;
        bpTbVsL += (4 * tempbpHrVsL) + tempbpHitVsL;

        // ballpark calculations vs Righty pitchers
        if (hitter.bats === 'L' || hitter.bats === 'S') {
            bpAdjVsR = bpHRAdjCalculate(t.st_hr_l);
            bpSiAdjVsR = bpSiAdjCalculate(t.st_si_l);
            clAdjVsR = CLUTCH_ADJUST_VALUE * hitter.cl_v_r;
        } else if (hitter.bats === 'R') {
            bpAdjVsR = bpHRAdjCalculate(t.st_hr_r);
            bpSiAdjVsR = bpSiAdjCalculate(t.st_si_r);
            clAdjVsR = CLUTCH_ADJUST_VALUE * hitter.cl_v_r;
        }
        if (hitter.bp_si_v_r === 0) {
            bpSiAdjVsR = 0;
            clAdjVsR = 0;
        }
        bpSiVsR += (clAdjVsR + bpSiAdjVsR) * t.ab / hitter.ab;
        tempbpHrVsR = bpAdjVsR * hitter.bp_hr_v_r * t.ab / hitter.ab;
        bpHrVsR += tempbpHrVsR;
        tempbpHitVsR = hitter.bp_si_v_r * t.ab / hitter.ab;
        bpHitVsR += tempbpHrVsR + tempbpHitVsR;
        bpTbVsR += (4 * tempbpHrVsR) + tempbpHitVsR;
        // end ballpark calculations
    });

    const obVsL = parseFloat(hitter.ob_v_l) + bpHitVsL + bpSiVsL;
    const tbVsL = parseFloat(hitter.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(hitter.ob_v_r) + bpHitVsR + bpSiVsR;
    const tbVsR = parseFloat(hitter.tb_v_r) + bpTbVsR + bpSiVsR;

    // start wOPS calculations
    const wAdjVsL = hitter.w_v_l === 'w' ? TB_VALUE * 9 : 0;
    const wopsVsL = wOPSCalculate(obVsL, tbVsL, hitter.dp_v_l, wAdjVsL);
    const wAdjVsR = hitter.w_v_r === 'w' ? TB_VALUE * 9 : 0;
    const wopsVsR = wOPSCalculate(obVsR, tbVsR, hitter.dp_v_r, wAdjVsR);

    return {
        hit_v_l: roundTo(parseFloat(hitter.hit_v_l) + bpHitVsL + bpSiVsL, 1),
        ob_v_l: roundTo(obVsL, 1),
        tb_v_l: roundTo(tbVsL, 1),
        hr_v_l: roundTo(parseFloat(hitter.hr_v_l) + bpHrVsL, 1),
        hit_v_r: roundTo(parseFloat(hitter.hit_v_r) + bpHitVsR + bpSiVsR, 1),
        ob_v_r: roundTo(obVsR, 1),
        tb_v_r: roundTo(tbVsR, 1),
        hr_v_r: roundTo(parseFloat(hitter.hr_v_r) + bpHrVsR, 1),
        wopsVsL,
        wopsVsR,
    };
}

function withoutBPCalculations(hitter: HitterDataFromDB) {
    return {
        hit_v_l: `~${roundTo(parseFloat(hitter.hit_v_l) + hitter.bp_si_v_l, 1)}`,
        ob_v_l: `~${roundTo(parseFloat(hitter.ob_v_l) + hitter.bp_si_v_l, 1)}`,
        tb_v_l: `~${roundTo(parseFloat(hitter.tb_v_l) + hitter.bp_si_v_l, 1)}`,
        hr_v_l: `~${roundTo(parseFloat(hitter.hr_v_l), 1)}/${hitter.bp_hr_v_l}`,
        hit_v_r: `~${roundTo(parseFloat(hitter.hit_v_r) + hitter.bp_si_v_r, 1)}`,
        ob_v_r: `~${roundTo(parseFloat(hitter.ob_v_r) + hitter.bp_si_v_r, 1)}`,
        tb_v_r: `~${roundTo(parseFloat(hitter.tb_v_r) + hitter.bp_si_v_r, 1)}`,
        hr_v_r: `~${roundTo(parseFloat(hitter.hr_v_r), 1)}/${hitter.bp_hr_v_r}`,
        wopsVsL: '',
        wopsVsR: '',
    };
}

function mainCalculations(hitter: HitterDataFromDB, partials: MultiTeamHitterDataFromDB[] = []) {
    if (hitter.real_team_id !== 1) {
        return ballparkCalculations(hitter);
    } else {
        // check to see if the AB totals in TOT match the parts in the multi_team_hitters table
        const partialABTotal = partials.reduce((acc, cur) => acc + cur.ab, 0);
        return hitter.ab === partialABTotal ? multiBallparkCalculations(hitter, partials) : withoutBPCalculations(hitter);
    }
}

export function calculateHitterValues(hittersArr: HitterDataFromDB[], multiData: MultiTeamHitterDataFromDB[]) {
    try {
        const hittersTeamsAndABPerTeam: MultiTeamHitterDataFromDB[] = JSON.parse(JSON.stringify(multiData));

        const hittersCalculated = hittersArr.map(h => {
            let result: { hit_v_l: string; ob_v_l: string; tb_v_l: string; hr_v_l: string; hit_v_r: string; ob_v_r: string; tb_v_r: string; hr_v_r: string; wopsVsL: number; wopsVsR: number; } | { hit_v_l: string; ob_v_l: string; tb_v_l: string; hr_v_l: string; hit_v_r: string; ob_v_r: string; tb_v_r: string; hr_v_r: string; wopsVsL: string; wopsVsR: string; };
            if (h.real_team_id === 1) {
                const partialTeams = hittersTeamsAndABPerTeam.filter(hp => hp.hitter.toLowerCase() === h.name.toLowerCase());
                result = mainCalculations(h, partialTeams);
            } else {
                result = mainCalculations(h);
            }

            function formatDefWops(position: keyof Positions, defRating: DefRating) {
                if (!defRating) {
                    return '';
                }
                if (typeof result.wopsVsL === 'string' && typeof result.wopsVsR === 'string') {
                    return `~${fieldingWopsCalculate(position, defRating)}`;
                }
                if (typeof result.wopsVsL === 'string' || typeof result.wopsVsR === 'string') {
                    return '';
                }
                const wopsL = roundTo(result.wopsVsL + fieldingWopsCalculate(position, defRating), 1);
                const wopsR = roundTo(result.wopsVsR + fieldingWopsCalculate(position, defRating), 1);
                return `${wopsL}/${wopsR}`;
            }

            return {
                year: h.year,
                real_team: h.real_team,
                name: h.name,
                bats: h.bats,
                injury: h.injury,
                ab: h.ab,
                so_v_l: h.so_v_l,
                bb_v_l: h.bb_v_l,
                hit_v_l: result.hit_v_l,
                ob_v_l: result.ob_v_l,
                tb_v_l: result.tb_v_l,
                hr_v_l: result.hr_v_l,
                w_v_l: processWColumn(h.w_v_l, h.bp_si_v_l),
                dp_v_l: h.dp_v_l,
                wops_v_l: typeof (result.wopsVsL) === 'string' ? '' : roundTo(result.wopsVsL, 1),
                so_v_r: h.so_v_r,
                bb_v_r: h.bb_v_r,
                hit_v_r: result.hit_v_r,
                ob_v_r: result.ob_v_r,
                tb_v_r: result.tb_v_r,
                hr_v_r: result.hr_v_r,
                w_v_r: processWColumn(h.w_v_r, h.bp_si_v_r),
                dp_v_r: h.dp_v_r,
                wops_v_r: typeof (result.wopsVsR) === 'string' ? '' : roundTo(result.wopsVsR, 1),
                stealing: h.stealing,
                spd: h.spd,
                bunt: h.bunt,
                h_r: h.h_r,
                d_ca: h.d_ca,
                d_1b: h.d_1b,
                d_2b: h.d_2b,
                d_3b: h.d_3b,
                d_ss: h.d_ss,
                d_lf: h.d_lf,
                d_cf: h.d_cf,
                d_rf: h.d_rf,
                def_wops_ca: formatDefWops('CA', h.d_ca as DefRating),
                def_wops_1b: formatDefWops('1B', h.d_1b as DefRating),
                def_wops_2b: formatDefWops('2B', h.d_2b as DefRating),
                def_wops_3b: formatDefWops('3B', h.d_3b as DefRating),
                def_wops_ss: formatDefWops('SS', h.d_ss as DefRating),
                def_wops_lf: formatDefWops('LF', h.d_lf as DefRating),
                def_wops_cf: formatDefWops('CF', h.d_cf as DefRating),
                def_wops_rf: formatDefWops('RF', h.d_rf as DefRating),
                fielding: h.fielding,
                rml_team_name: h.rml_team_name || '',
            };
        });
        return hittersCalculated;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}
