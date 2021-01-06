const processBpColumn = (bpsi) => bpsi === 0 ? '*' : '';

const ballparkCalculations = (pitcher) => {
    const obValue = 1.2;
    const tbValue = 0.845;

    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;

    // ballpark calculations vs Lefty hitters
    bpAdjVsL = ((pitcher.st_hr_l / 20) + 0.45) / 2;
    bpSiAdjVsL = 5 * ((pitcher.st_si_l + 8) / 40) - 2;
    if (pitcher.bp_si_v_l === 0) bpSiAdjVsL = 0;
    const bpSiVsL = bpSiAdjVsL;
    const bpHrVsL = bpAdjVsL * pitcher.bp_hr_v_l;
    const bpHitVsL = bpHrVsL + pitcher.bp_si_v_l;
    const bpObVsL = bpHrVsL + pitcher.bp_si_v_l;
    const bpTbVsL = (4 * bpHrVsL) + pitcher.bp_si_v_l;

    // ballpark calculations vs Righty hitters
    bpAdjVsR = ((pitcher.st_hr_r / 20) + 0.45) / 2;
    bpSiAdjVsR = 5 * ((pitcher.st_si_r + 8) / 40) - 2;
    if (pitcher.bp_si_v_r === 0) bpSiAdjVsR = 0;
    const bpSiVsR = bpSiAdjVsR;
    const bpHrVsR = bpAdjVsR * pitcher.bp_hr_v_r;
    const bpHitVsR = bpHrVsR + pitcher.bp_si_v_r;
    const bpObVsR = bpHrVsR + pitcher.bp_si_v_r;
    const bpTbVsR = (4 * bpHrVsR) + pitcher.bp_si_v_r;
    // end ballpark calculations

    const obVsL = parseFloat(pitcher.ob_v_l) + bpObVsL + bpSiVsL;
    const tbVsL = parseFloat(pitcher.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(pitcher.ob_v_r) + bpObVsR + bpSiVsR;
    const tbVsR = parseFloat(pitcher.tb_v_r) + bpTbVsR + bpSiVsR;

    // start calculating fielding impact on wOPS
    const range = parseInt(pitcher.fielding.charAt(0));
    const eNum = parseInt(pitcher.fielding.substring(2, 4));
    const gbpHits = (range - 1) * 0.1 * 2;
    const gbpErrors = eNum * 0.0172 * 2;
    const gbpWops = (obValue * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2) + tbValue * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2)) + (obValue * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2) + tbValue * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2)) + (obValue * (((gbpHits / 2) * (gbpErrors / 2)) * 2) + 2 * tbValue * (((gbpHits / 2) * (gbpErrors / 2)) * 2));
    // end calculating fielding impact on wOPS

    // start wOPS calculations
    const wopsVsL = ((obValue * obVsL) + (tbValue * tbVsL) - (obValue * 20 * pitcher.dp_v_l / 108) + gbpWops + (0.103 * pitcher.balk) + (0.205 * pitcher.wp)).toFixed(1);
    const wopsVsR = ((obValue * obVsR) + (tbValue * tbVsR) - (obValue * 20 * pitcher.dp_v_r / 108) + gbpWops + (0.103 * pitcher.balk) + (0.205 * pitcher.wp)).toFixed(1);

    return {
        hit_v_l: (parseFloat(pitcher.hit_v_l) + bpHitVsL + bpSiVsL).toFixed(1),
        ob_v_l: obVsL.toFixed(1),
        tb_v_l: tbVsL.toFixed(1),
        hr_v_l: (parseFloat(pitcher.hr_v_l) + bpHrVsL).toFixed(1),
        hit_v_r: (parseFloat(pitcher.hit_v_r) + bpHitVsR + bpSiVsR).toFixed(1),
        ob_v_r: obVsR.toFixed(1),
        tb_v_r: tbVsR.toFixed(1),
        hr_v_r: (parseFloat(pitcher.hr_v_r) + bpHrVsR).toFixed(1),
        wopsVsL,
        wopsVsR,
    };
};

const multiBallparkCalculations = (pitcher, partials) => {
    const obValue = 1.2;
    const tbValue = 0.845;

    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;

    let bpSiVsR = 0;
    let bpHrVsR = 0;
    let bpHitVsR = 0;
    let bpObVsR = 0;
    let bpTbVsR = 0;

    let bpSiVsL = 0;
    let bpHrVsL = 0;
    let bpHitVsL = 0;
    let bpObVsL = 0;
    let bpTbVsL = 0;

    partials.forEach(t => {
        // ballpark calculations vs Lefty hitters
        bpAdjVsL = ((t.st_hr_l / 20) + 0.45) / 2;
        bpSiAdjVsL = 5 * ((t.st_si_l + 8) / 40) - 2;
        if (pitcher.bp_si_v_l === 0) bpSiAdjVsL = 0;
        bpSiVsL += (bpSiAdjVsL) * t.ip / parseFloat(pitcher.ip);
        bpHrVsL += (bpAdjVsL * pitcher.bp_hr_v_l) * t.ip / parseFloat(pitcher.ip);
        bpHitVsL += (bpHrVsL + pitcher.bp_si_v_l) * t.ip / parseFloat(pitcher.ip);
        bpObVsL += (bpHrVsL + pitcher.bp_si_v_l) * t.ip / parseFloat(pitcher.ip);
        bpTbVsL += ((4 * bpHrVsL) + pitcher.bp_si_v_l) * t.ip / parseFloat(pitcher.ip);

        // ballpark calculations vs Righty hitters
        bpAdjVsR = ((t.st_hr_r / 20) + 0.45) / 2;
        bpSiAdjVsR = 5 * ((t.st_si_r + 8) / 40) - 2;
        if (pitcher.bp_si_v_r === 0) bpSiAdjVsR = 0;
        bpSiVsR += (bpSiAdjVsR) * t.ip / parseFloat(pitcher.ip);
        bpHrVsR += (bpAdjVsR * pitcher.bp_hr_v_r) * t.ip / parseFloat(pitcher.ip);
        bpHitVsR += (bpHrVsR + pitcher.bp_si_v_r) * t.ip / parseFloat(pitcher.ip);
        bpObVsR += (bpHrVsR + pitcher.bp_si_v_r) * t.ip / parseFloat(pitcher.ip);
        bpTbVsR += ((4 * bpHrVsR) + pitcher.bp_si_v_r) * t.ip / parseFloat(pitcher.ip);
        // end ballpark calculations
    });

    const obVsL = parseFloat(pitcher.ob_v_l) + bpObVsL + bpSiVsL;
    const tbVsL = parseFloat(pitcher.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(pitcher.ob_v_r) + bpObVsR + bpSiVsR;
    const tbVsR = parseFloat(pitcher.tb_v_r) + bpTbVsR + bpSiVsR;

    // start calculating fielding impact on wOPS
    const range = parseInt(pitcher.fielding.charAt(0));
    const eNum = parseInt(pitcher.fielding.substring(2, 4));
    const gbpHits = (range - 1) * 0.1 * 2;
    const gbpErrors = eNum * 0.0172 * 2;
    const gbpWops = (obValue * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2) + tbValue * ((((2 - gbpErrors) / 2) * (gbpHits / 2)) * 2)) + (obValue * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2) + tbValue * ((((2 - gbpHits) / 2) * (gbpErrors / 2)) * 2)) + (obValue * (((gbpHits / 2) * (gbpErrors / 2)) * 2) + 2 * tbValue * (((gbpHits / 2) * (gbpErrors / 2)) * 2));
    // end calculating fielding impact on wOPS

    // start wOPS calculations
    const wopsVsL = ((obValue * obVsL) + (tbValue * tbVsL) - (obValue * 20 * pitcher.dp_v_l / 108) + gbpWops + (0.103 * pitcher.balk) + (0.205 * pitcher.wp)).toFixed(1);
    const wopsVsR = ((obValue * obVsR) + (tbValue * tbVsR) - (obValue * 20 * pitcher.dp_v_r / 108) + gbpWops + (0.103 * pitcher.balk) + (0.205 * pitcher.wp)).toFixed(1);

    return {
        hit_v_l: (parseFloat(pitcher.hit_v_l) + bpHitVsL + bpSiVsL).toFixed(1),
        ob_v_l: obVsL.toFixed(1),
        tb_v_l: tbVsL.toFixed(1),
        hr_v_l: (parseFloat(pitcher.hr_v_l) + bpHrVsL).toFixed(1),
        hit_v_r: (parseFloat(pitcher.hit_v_r) + bpHitVsR + bpSiVsR).toFixed(1),
        ob_v_r: obVsR.toFixed(1),
        tb_v_r: tbVsR.toFixed(1),
        hr_v_r: (parseFloat(pitcher.hr_v_r) + bpHrVsR).toFixed(1),
        wopsVsL,
        wopsVsR,
    };
};

const withoutBPCalculations = (pitcher) => {
    return {
        hit_v_l: `~${(parseFloat(pitcher.hit_v_l) + pitcher.bp_si_v_l).toFixed(1)}`,
        ob_v_l: `~${(parseFloat(pitcher.ob_v_l) + pitcher.bp_si_v_l).toFixed(1)}`,
        tb_v_l: `~${(parseFloat(pitcher.tb_v_l) + pitcher.bp_si_v_l).toFixed(1)}`,
        hr_v_l: `~${(parseFloat(pitcher.hr_v_l)).toFixed(1)}/${pitcher.bp_hr_v_l}`,
        hit_v_r: `~${(parseFloat(pitcher.hit_v_r) + pitcher.bp_si_v_r).toFixed(1)}`,
        ob_v_r: `~${(parseFloat(pitcher.ob_v_r) + pitcher.bp_si_v_r).toFixed(1)}`,
        tb_v_r: `~${(parseFloat(pitcher.tb_v_r) + pitcher.bp_si_v_r).toFixed(1)}`,
        hr_v_r: `~${(parseFloat(pitcher.hr_v_r)).toFixed(1)}/${pitcher.bp_hr_v_r}`,
        wopsVsL: '',
        wopsVsR: '',
    };
};

const mainCalculations = (pitcher, partials = []) => {
    if (pitcher.real_team_id !== 1) {
        return ballparkCalculations(pitcher);
    } else {
        const partialIPTotal = partials.reduce((acc, cur) => {
            return acc + parseFloat(cur.ip);
        }, 0);

        // check to see if the IP totals in TOT match the parts in the multi_team_pitchers table
        if (pitcher.ip === Math.round(partialIPTotal)) {
            return multiBallparkCalculations(pitcher, partials);
        } else {
            // since they don't match, return as before with no wOPS numbers
            console.log('The IP totals do NOT match:', pitcher.ip, Math.round(partialIPTotal));
            return withoutBPCalculations(pitcher);
        }
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
            rml_team_name: p.rml_team_name,
        };
    });
    return PitchersCalculated;
};

module.exports = calculatePitcherValues;
