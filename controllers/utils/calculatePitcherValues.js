const { OB_VALUE, TB_VALUE, BALK_VALUE, WP_VALUE } = require('./constants');
const { bpHRAdjCalculate, bpSiAdjCalculate } = require('./bpCalculateFunctions');

const roundTo = require('./roundTo');

const processBpColumn = (bpsi) => bpsi === 0 ? '*' : '';

const gbpWopsCalculate = (fielding) => {
    const gbpHits = (parseInt(fielding.charAt(0)) - 1) * 0.1 * 2;
    // const gbpErrors = parseInt(fielding.substring(2, 4)) * 0.0172 * 2;
    const gbpErrors = parseInt(fielding.substring(2, 4)) * 0.0180 * 2;
    const gbpTwoBaseErrorTotalBaseAdj = TB_VALUE * gbpErrors / 20;
    const gbpWopsOnHitsOnly = OB_VALUE * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2) + TB_VALUE * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2);
    const gbpWopsOnErrorsOnly = OB_VALUE * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2) + TB_VALUE * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2);
    const gbpWopsOnHitAndError = OB_VALUE * (((gbpHits / 2) * (gbpErrors / 2)) * 2) + 2 * TB_VALUE * (((gbpHits / 2) * (gbpErrors / 2)) * 2);
    // console.log(fielding, gbpWopsOnHitsOnly, gbpWopsOnErrorsOnly, gbpWopsOnHitAndError);
    // console.log('old gbpWopsCalculate:', (OB_VALUE * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2) + TB_VALUE * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2)) + (OB_VALUE * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2) + TB_VALUE * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2)) + (OB_VALUE * (((gbpHits / 2) * (gbpErrors / 2)) * 2) + 2 * TB_VALUE * (((gbpHits / 2) * (gbpErrors / 2)) * 2)));
    // console.log('new gbpWopsCalculate:', gbpWopsOnHitsOnly + gbpWopsOnErrorsOnly + gbpWopsOnHitAndError + gbpTwoBaseErrorTotalBaseAdj);
    // return (OB_VALUE * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2) + TB_VALUE * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2)) + (OB_VALUE * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2) + TB_VALUE * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2)) + (OB_VALUE * (((gbpHits / 2) * (gbpErrors / 2)) * 2) + 2 * TB_VALUE * (((gbpHits / 2) * (gbpErrors / 2)) * 2));
    return gbpWopsOnHitsOnly + gbpWopsOnErrorsOnly + gbpWopsOnHitAndError + gbpTwoBaseErrorTotalBaseAdj;
};
const wOPSCalculate = (ob, tb, dp, gbp, bk, wp) => (OB_VALUE * ob) + (TB_VALUE * tb) - (OB_VALUE * 20 * dp / 108) + gbp + (BALK_VALUE * bk) + (WP_VALUE * wp);

const ballparkCalculations = (pitcher) => {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;

    // ballpark calculations vs Lefty hitters
    bpAdjVsL = bpHRAdjCalculate(pitcher.st_hr_l);
    bpSiAdjVsL = bpSiAdjCalculate(pitcher.st_si_l);
    if (pitcher.bp_si_v_l === 0) bpSiAdjVsL = 0;
    const bpSiVsL = bpSiAdjVsL;
    const bpHrVsL = bpAdjVsL * pitcher.bp_hr_v_l;
    const bpHitVsL = bpHrVsL + pitcher.bp_si_v_l;
    const bpTbVsL = (4 * bpHrVsL) + pitcher.bp_si_v_l;

    // ballpark calculations vs Righty hitters
    bpAdjVsR = bpHRAdjCalculate(pitcher.st_hr_r);
    bpSiAdjVsR = bpSiAdjCalculate(pitcher.st_si_r);
    if (pitcher.bp_si_v_r === 0) bpSiAdjVsR = 0;
    const bpSiVsR = bpSiAdjVsR;
    const bpHrVsR = bpAdjVsR * pitcher.bp_hr_v_r;
    const bpHitVsR = bpHrVsR + pitcher.bp_si_v_r;
    const bpTbVsR = (4 * bpHrVsR) + pitcher.bp_si_v_r;
    // end ballpark calculations

    const obVsL = parseFloat(pitcher.ob_v_l) + bpHitVsL + bpSiVsL;
    const tbVsL = parseFloat(pitcher.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(pitcher.ob_v_r) + bpHitVsR + bpSiVsR;
    const tbVsR = parseFloat(pitcher.tb_v_r) + bpTbVsR + bpSiVsR;

    // fielding (GB(p)X) impact on wOPS
    const gbpWops = gbpWopsCalculate(pitcher.fielding);

    // start wOPS calculations
    const wopsVsL = roundTo(wOPSCalculate(obVsL, tbVsL, pitcher.dp_v_l, gbpWops, pitcher.balk, pitcher.wp), 1);
    const wopsVsR = roundTo(wOPSCalculate(obVsR, tbVsR, pitcher.dp_v_r, gbpWops, pitcher.balk, pitcher.wp), 1);

    return {
        hit_v_l: roundTo(parseFloat(pitcher.hit_v_l) + bpHitVsL + bpSiVsL, 1),
        ob_v_l: roundTo(obVsL, 1),
        tb_v_l: roundTo(tbVsL, 1),
        hr_v_l: roundTo(parseFloat(pitcher.hr_v_l) + bpHrVsL, 1),
        hit_v_r: roundTo(parseFloat(pitcher.hit_v_r) + bpHitVsR + bpSiVsR, 1),
        ob_v_r: roundTo(obVsR, 1),
        tb_v_r: roundTo(tbVsR, 1),
        hr_v_r: roundTo(parseFloat(pitcher.hr_v_r) + bpHrVsR, 1),
        wopsVsL,
        wopsVsR,
    };
};

const multiBallparkCalculations = (pitcher, partials) => {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;

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
        // ballpark calculations vs Lefty hitters
        bpAdjVsL = bpHRAdjCalculate(t.st_hr_l);
        bpSiAdjVsL = bpSiAdjCalculate(t.st_si_l);
        if (pitcher.bp_si_v_l === 0) bpSiAdjVsL = 0;
        bpSiVsL += bpSiAdjVsL * t.ip / parseFloat(pitcher.ip);
        tempbpHrVsL = bpAdjVsL * pitcher.bp_hr_v_l * t.ip / parseFloat(pitcher.ip);
        bpHrVsL += tempbpHrVsL;
        tempbpHitVsL = pitcher.bp_si_v_l * t.ip / parseFloat(pitcher.ip);
        bpHitVsL += tempbpHrVsL + tempbpHitVsL;
        bpTbVsL += (4 * tempbpHrVsL) + tempbpHitVsL;

        // ballpark calculations vs Righty hitters
        bpAdjVsR = bpHRAdjCalculate(t.st_hr_r);
        bpSiAdjVsR = bpSiAdjCalculate(t.st_si_r);
        if (pitcher.bp_si_v_r === 0) bpSiAdjVsR = 0;
        bpSiVsR += bpSiAdjVsR * t.ip / parseFloat(pitcher.ip);
        tempbpHrVsR = bpAdjVsR * pitcher.bp_hr_v_r * t.ip / parseFloat(pitcher.ip);
        bpHrVsR += tempbpHrVsR;
        tempbpHitVsR = pitcher.bp_si_v_r * t.ip / parseFloat(pitcher.ip);
        bpHitVsR += tempbpHrVsR + tempbpHitVsR;
        bpTbVsR += (4 * tempbpHrVsR) + tempbpHitVsR;
        // end ballpark calculations
    });

    const obVsL = parseFloat(pitcher.ob_v_l) + bpHitVsL + bpSiVsL;
    const tbVsL = parseFloat(pitcher.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(pitcher.ob_v_r) + bpHitVsR + bpSiVsR;
    const tbVsR = parseFloat(pitcher.tb_v_r) + bpTbVsR + bpSiVsR;

    // fielding (GB(p)X) impact on wOPS
    const gbpWops = gbpWopsCalculate(pitcher.fielding);

    // start wOPS calculations
    const wopsVsL = roundTo(wOPSCalculate(obVsL, tbVsL, pitcher.dp_v_l, gbpWops, pitcher.balk, pitcher.wp), 1);
    const wopsVsR = roundTo(wOPSCalculate(obVsR, tbVsR, pitcher.dp_v_r, gbpWops, pitcher.balk, pitcher.wp), 1);

    return {
        hit_v_l: roundTo(parseFloat(pitcher.hit_v_l) + bpHitVsL + bpSiVsL, 1),
        ob_v_l: roundTo(obVsL, 1),
        tb_v_l: roundTo(tbVsL, 1),
        hr_v_l: roundTo(parseFloat(pitcher.hr_v_l) + bpHrVsL, 1),
        hit_v_r: roundTo(parseFloat(pitcher.hit_v_r) + bpHitVsR + bpSiVsR, 1),
        ob_v_r: roundTo(obVsR, 1),
        tb_v_r: roundTo(tbVsR, 1),
        hr_v_r: roundTo(parseFloat(pitcher.hr_v_r) + bpHrVsR, 1),
        wopsVsL,
        wopsVsR,
    };
};

const withoutBPCalculations = (pitcher) => {
    return {
        hit_v_l: `~${roundTo(parseFloat(pitcher.hit_v_l) + pitcher.bp_si_v_l, 1)}`,
        ob_v_l: `~${roundTo(parseFloat(pitcher.ob_v_l) + pitcher.bp_si_v_l, 1)}`,
        tb_v_l: `~${roundTo(parseFloat(pitcher.tb_v_l) + pitcher.bp_si_v_l, 1)}`,
        hr_v_l: `~${roundTo(parseFloat(pitcher.hr_v_l), 1)}/${pitcher.bp_hr_v_l}`,
        hit_v_r: `~${roundTo(parseFloat(pitcher.hit_v_r) + pitcher.bp_si_v_r, 1)}`,
        ob_v_r: `~${roundTo(parseFloat(pitcher.ob_v_r) + pitcher.bp_si_v_r, 1)}`,
        tb_v_r: `~${roundTo(parseFloat(pitcher.tb_v_r) + pitcher.bp_si_v_r, 1)}`,
        hr_v_r: `~${roundTo(parseFloat(pitcher.hr_v_r), 1)}/${pitcher.bp_hr_v_r}`,
        wopsVsL: '',
        wopsVsR: '',
    };
};

const mainCalculations = (pitcher, partials = []) => {
    if (pitcher.real_team_id !== 1) {
        return ballparkCalculations(pitcher);
    } else {
        // check to see if the IP totals in TOT match the parts in the multi_team_pitchers table
        const partialIPTotal = partials.reduce((acc, cur) => acc + parseFloat(cur.ip), 0);
        return pitcher.ip === Math.round(partialIPTotal) ? multiBallparkCalculations(pitcher, partials) : withoutBPCalculations(pitcher);
    }
};

const calculatePitcherValues = (pitchersArr, multiData) => {
    const pitchersTeamsAndIPPerTeam = JSON.parse(JSON.stringify(multiData));

    const PitchersCalculated = pitchersArr.map(p => {
        let result;
        if (p.real_team_id === 1) {
            const partialTeams = pitchersTeamsAndIPPerTeam.filter(pp => pp.pitcher === p.pitcher_name);
            result = mainCalculations(p, partialTeams);
        } else {
            result = mainCalculations(p);
        }

        return {
            p_year: p.p_year,
            real_team: p.real_team,
            pitcher_name: p.pitcher_name,
            throws: p.throws,
            ip: p.ip,
            so_v_l: p.so_v_l,
            bb_v_l: p.bb_v_l,
            hit_v_l: result.hit_v_l,
            ob_v_l: result.ob_v_l,
            tb_v_l: result.tb_v_l,
            hr_v_l: result.hr_v_l,
            bp_v_l: processBpColumn(p.bp_si_v_l),
            dp_v_l: p.dp_v_l,
            wops_v_l: result.wopsVsL,
            so_v_r: p.so_v_r,
            bb_v_r: p.bb_v_r,
            hit_v_r: result.hit_v_r,
            ob_v_r: result.ob_v_r,
            tb_v_r: result.tb_v_r,
            hr_v_r: result.hr_v_r,
            bp_v_r: processBpColumn(p.bp_si_v_r),
            dp_v_r: p.dp_v_r,
            wops_v_r: result.wopsVsR,
            hold: p.hold,
            endurance: p.endurance,
            fielding: p.fielding,
            balk: p.balk,
            wp: p.wp,
            batting_b: p.batting_b,
            stl: p.stl,
            spd: p.spd,
            rml_team_name: p.rml_team_name ? p.rml_team_name : '',
        };
    });
    return PitchersCalculated;
};

module.exports = calculatePitcherValues;
