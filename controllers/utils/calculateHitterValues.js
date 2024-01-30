const { OB_VALUE, TB_VALUE, CLUTCH_ADJUST_VALUE } = require('./constants');

const { bpHRAdjCalculate, bpSiAdjCalculate } = require('./bpCalculateFunctions');

const roundTo = require('./roundTo');

const processWColumn = (w, bpsi) => {
    let wCol = '';

    if (w === 'w') wCol += 'w';
    if (bpsi === 0) wCol += '*';

    return wCol;
};

const wOPSCalculate = (ob, tb, dp, wAdj) => ((OB_VALUE * ob) + (TB_VALUE * tb) - (OB_VALUE * 20 * dp / 108)) - wAdj;

const ballparkCalculations = (hitter) => {
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
    const wopsVsL = roundTo(wOPSCalculate(obVsL, tbVsL, hitter.dp_v_l, wAdjVsL), 1);
    const wAdjVsR = hitter.w_v_r === 'w' ? TB_VALUE * 9 : 0;
    const wopsVsR = roundTo(wOPSCalculate(obVsR, tbVsR, hitter.dp_v_r, wAdjVsR), 1);

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
};

const multiBallparkCalculations = (hitter, partials) => {
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
    const wopsVsL = roundTo(wOPSCalculate(obVsL, tbVsL, hitter.dp_v_l, wAdjVsL), 1);
    const wAdjVsR = hitter.w_v_r === 'w' ? TB_VALUE * 9 : 0;
    const wopsVsR = roundTo(wOPSCalculate(obVsR, tbVsR, hitter.dp_v_r, wAdjVsR), 1);

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
};

const withoutBPCalculations = (hitter) => {
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
};

const mainCalculations = (hitter, partials = []) => {
    if (hitter.real_team_id !== 1) {
        return ballparkCalculations(hitter);
    } else {
        // check to see if the AB totals in TOT match the parts in the multi_team_hitters table
        const partialABTotal = partials.reduce((acc, cur) => acc + cur.ab, 0);
        return hitter.ab === partialABTotal ? multiBallparkCalculations(hitter, partials) : withoutBPCalculations(hitter);
    }
};

const calculateHitterValues = (hittersArr, multiData) => {
    const hittersTeamsAndABPerTeam = JSON.parse(JSON.stringify(multiData));

    const hittersCalculated = hittersArr.map(h => {
        let result;
        if (h.real_team_id === 1) {
            const partialTeams = hittersTeamsAndABPerTeam.filter(hp => hp.hitter === h.name);
            result = mainCalculations(h, partialTeams);
        } else {
            result = mainCalculations(h);
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
            wops_v_l: result.wopsVsL,
            so_v_r: h.so_v_r,
            bb_v_r: h.bb_v_r,
            hit_v_r: result.hit_v_r,
            ob_v_r: result.ob_v_r,
            tb_v_r: result.tb_v_r,
            hr_v_r: result.hr_v_r,
            w_v_r: processWColumn(h.w_v_r, h.bp_si_v_r),
            dp_v_r: h.dp_v_r,
            wops_v_r: result.wopsVsR,
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
            rml_team_name: h.rml_team_name ? h.rml_team_name : '',
        };
    });
    return hittersCalculated;
};

module.exports = calculateHitterValues;
