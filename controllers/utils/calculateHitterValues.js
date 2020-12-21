const processWColumn = (realTeamId, bphr, w, bpsi) => {
    let wCol = '';

    if (realTeamId !== 1) {
        if (w === 'w') wCol += 'w';
    } else {
        wCol += '~';
        w === 'w' ? wCol += 'w' : wCol += bphr;
    }
    if (bpsi === 0) wCol += '*';

    return wCol;
};

const ballparkCalculations = (hitter) => {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let clAdjVsL = 0;
    let bpSiVsL = 0;
    let bpHrVsL = 0;
    let bpHitVsL = 0;
    let bpObVsL = 0;
    let bpTbVsL = 0;

    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;
    let clAdjVsR = 0;
    let bpSiVsR = 0;
    let bpHrVsR = 0;
    let bpHitVsR = 0;
    let bpObVsR = 0;
    let bpTbVsR = 0;

    if (hitter.real_team_id !== 1) {
        // ballpark calculations vs Lefty pitchers
        if (hitter.bats === 'L') {
            bpAdjVsL = ((hitter.st_hr_l / 20) + 0.45) / 2;
            bpSiAdjVsL = 5 * ((hitter.st_si_l + 8) / 40) - 2;
            clAdjVsL = 0.12 * hitter.cl_v_l;
        } else if (hitter.bats === 'R' || hitter.bats === 'S') {
            bpAdjVsL = ((hitter.st_hr_r / 20) + 0.45) / 2;
            bpSiAdjVsL = 5 * ((hitter.st_si_r + 8) / 40) - 2;
            clAdjVsL = 0.12 * hitter.cl_v_l;
        }
        if (hitter.bp_si_v_l === 0) {
            bpSiAdjVsL = 0;
            clAdjVsL = 0;
        }
        bpSiVsL = clAdjVsL + bpSiAdjVsL;
        bpHrVsL = bpAdjVsL * hitter.bp_hr_v_l;
        bpHitVsL = bpHrVsL + hitter.bp_si_v_l;
        bpObVsL = bpHrVsL + hitter.bp_si_v_l;
        bpTbVsL = (4 * bpHrVsL) + hitter.bp_si_v_l;

        // ballpark calculations vs Righty pitchers
        if (hitter.bats === 'L' || hitter.bats === 'S') {
            bpAdjVsR = ((hitter.st_hr_l / 20) + 0.45) / 2;
            bpSiAdjVsR = 5 * ((hitter.st_si_l + 8) / 40) - 2;
            clAdjVsR = 0.12 * hitter.cl_v_r;
        } else if (hitter.bats === 'R') {
            bpAdjVsR = ((hitter.st_hr_r / 20) + 0.45) / 2;
            bpSiAdjVsR = 5 * ((hitter.st_si_r + 8) / 40) - 2;
            clAdjVsR = 0.12 * hitter.cl_v_r;
        }
        if (hitter.bp_si_v_r === 0) {
            bpSiAdjVsR = 0;
            clAdjVsR = 0;
        }
        bpSiVsR = clAdjVsR + bpSiAdjVsR;
        bpHrVsR = bpAdjVsR * hitter.bp_hr_v_r;
        bpHitVsR = bpHrVsR + hitter.bp_si_v_r;
        bpObVsR = bpHrVsR + hitter.bp_si_v_r;
        bpTbVsR = (4 * bpHrVsR) + hitter.bp_si_v_r;
    }
};

const mainCalculations = (hitter) => {

};

const calculateHitterValues = (hittersArr) => {
    const hittersCalculated = hittersArr.map(h => {
        const result = mainCalculations(h);

        return {
            h_year: h.h_year,
            real_team: h.real_team,
            hitter_name: h.hitter_name,
            bats: h.bats,
            injury: h.injury,
            ab: h.ab,
            so_v_l: h.so_v_l,
            bb_v_l: h.bb_v_l,
            w_v_l: processWColumn(h.real_team_id, h.bp_hr_v_l, h.w_v_l, h.bp_si_v_l),
            dp_v_l: h.dp_v_l,
            so_v_r: h.so_v_r,
            bb_v_r: h.bb_v_r,
            w_v_r: processWColumn(h.real_team_id, h.bp_hr_v_r, h.w_v_r, h.bp_si_v_r),
            dp_v_r: h.dp_v_r,
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
            fielding: h.fielding,
            rml_team_name: h.rml_team_name,
        };
    });
    return hittersCalculated;
};

module.exports = calculateHitterValues;
