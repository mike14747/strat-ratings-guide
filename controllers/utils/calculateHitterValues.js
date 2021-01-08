const processWColumn = (w, bpsi) => {
    let wCol = '';

    if (w === 'w') wCol += 'w';
    if (bpsi === 0) wCol += '*';

    return wCol;
};

const obValue = 1.2;
const tbValue = 0.845;

const ballparkCalculations = (hitter) => {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let clAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;
    let clAdjVsR = 0;

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
    const bpSiVsL = clAdjVsL + bpSiAdjVsL;
    const bpHrVsL = bpAdjVsL * hitter.bp_hr_v_l;
    const bpHitVsL = bpHrVsL + hitter.bp_si_v_l;
    const bpObVsL = bpHrVsL + hitter.bp_si_v_l;
    const bpTbVsL = (4 * bpHrVsL) + hitter.bp_si_v_l;

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
    const bpSiVsR = clAdjVsR + bpSiAdjVsR;
    const bpHrVsR = bpAdjVsR * hitter.bp_hr_v_r;
    const bpHitVsR = bpHrVsR + hitter.bp_si_v_r;
    const bpObVsR = bpHrVsR + hitter.bp_si_v_r;
    const bpTbVsR = (4 * bpHrVsR) + hitter.bp_si_v_r;
    // end ballpark calculations

    const obVsL = parseFloat(hitter.ob_v_l) + bpObVsL + bpSiVsL;
    const tbVsL = parseFloat(hitter.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(hitter.ob_v_r) + bpObVsR + bpSiVsR;
    const tbVsR = parseFloat(hitter.tb_v_r) + bpTbVsR + bpSiVsR;

    // start wOPS calculations
    const wAdjVsL = hitter.w_v_l === 'w' ? tbValue * 9 : 0;
    const wopsVsL = (((obValue * obVsL) + (tbValue * tbVsL) - (obValue * 20 * hitter.dp_v_l / 108)) - wAdjVsL).toFixed(1);
    const wAdjVsR = hitter.w_v_r === 'w' ? tbValue * 9 : 0;
    const wopsVsR = (((obValue * obVsR) + (tbValue * tbVsR) - (obValue * 20 * hitter.dp_v_r / 108)) - wAdjVsR).toFixed(1);

    return {
        hit_v_l: (parseFloat(hitter.hit_v_l) + bpHitVsL + bpSiVsL).toFixed(1),
        ob_v_l: obVsL.toFixed(1),
        tb_v_l: tbVsL.toFixed(1),
        hr_v_l: (parseFloat(hitter.hr_v_l) + bpHrVsL).toFixed(1),
        hit_v_r: (parseFloat(hitter.hit_v_r) + bpHitVsR + bpSiVsR).toFixed(1),
        ob_v_r: obVsR.toFixed(1),
        tb_v_r: tbVsR.toFixed(1),
        hr_v_r: (parseFloat(hitter.hr_v_r) + bpHrVsR).toFixed(1),
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
        // ballpark calculations vs Lefty pitchers
        if (hitter.bats === 'L') {
            bpAdjVsL = ((t.st_hr_l / 20) + 0.45) / 2;
            bpSiAdjVsL = 5 * ((t.st_si_l + 8) / 40) - 2;
            clAdjVsL = 0.12 * hitter.cl_v_l;
        } else if (hitter.bats === 'R' || hitter.bats === 'S') {
            bpAdjVsL = ((t.st_hr_r / 20) + 0.45) / 2;
            bpSiAdjVsL = 5 * ((t.st_si_r + 8) / 40) - 2;
            clAdjVsL = 0.12 * hitter.cl_v_l;
        }
        if (hitter.bp_si_v_l === 0) {
            bpSiAdjVsL = 0;
            clAdjVsL = 0;
        }
        bpSiVsL += (clAdjVsL + bpSiAdjVsL) * t.ab / hitter.ab;
        bpHrVsL += (bpAdjVsL * hitter.bp_hr_v_l) * t.ab / hitter.ab;
        bpHitVsL += (bpHrVsL + hitter.bp_si_v_l) * t.ab / hitter.ab;
        bpObVsL += (bpHrVsL + hitter.bp_si_v_l) * t.ab / hitter.ab;
        bpTbVsL += ((4 * bpHrVsL) + hitter.bp_si_v_l) * t.ab / hitter.ab;

        // ballpark calculations vs Righty pitchers
        if (hitter.bats === 'L' || hitter.bats === 'S') {
            bpAdjVsR = ((t.st_hr_l / 20) + 0.45) / 2;
            bpSiAdjVsR = 5 * ((t.st_si_l + 8) / 40) - 2;
            clAdjVsR = 0.12 * hitter.cl_v_r;
        } else if (hitter.bats === 'R') {
            bpAdjVsR = ((t.st_hr_r / 20) + 0.45) / 2;
            bpSiAdjVsR = 5 * ((t.st_si_r + 8) / 40) - 2;
            clAdjVsR = 0.12 * hitter.cl_v_r;
        }
        if (hitter.bp_si_v_r === 0) {
            bpSiAdjVsR = 0;
            clAdjVsR = 0;
        }
        bpSiVsR += (clAdjVsR + bpSiAdjVsR) * t.ab / hitter.ab;
        bpHrVsR += (bpAdjVsR * hitter.bp_hr_v_r) * t.ab / hitter.ab;
        bpHitVsR += (bpHrVsR + hitter.bp_si_v_r) * t.ab / hitter.ab;
        bpObVsR += (bpHrVsR + hitter.bp_si_v_r) * t.ab / hitter.ab;
        bpTbVsR += ((4 * bpHrVsR) + hitter.bp_si_v_r) * t.ab / hitter.ab;
        // end ballpark calculations
    });

    const obVsL = parseFloat(hitter.ob_v_l) + bpObVsL + bpSiVsL;
    const tbVsL = parseFloat(hitter.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(hitter.ob_v_r) + bpObVsR + bpSiVsR;
    const tbVsR = parseFloat(hitter.tb_v_r) + bpTbVsR + bpSiVsR;

    // start wOPS calculations
    const wAdjVsL = hitter.w_v_l === 'w' ? tbValue * 9 : 0;
    const wopsVsL = (((obValue * obVsL) + (tbValue * tbVsL) - (obValue * 20 * hitter.dp_v_l / 108)) - wAdjVsL).toFixed(1);
    const wAdjVsR = hitter.w_v_r === 'w' ? tbValue * 9 : 0;
    const wopsVsR = (((obValue * obVsR) + (tbValue * tbVsR) - (obValue * 20 * hitter.dp_v_r / 108)) - wAdjVsR).toFixed(1);

    return {
        hit_v_l: (parseFloat(hitter.hit_v_l) + bpHitVsL + bpSiVsL).toFixed(1),
        ob_v_l: obVsL.toFixed(1),
        tb_v_l: tbVsL.toFixed(1),
        hr_v_l: (parseFloat(hitter.hr_v_l) + bpHrVsL).toFixed(1),
        hit_v_r: (parseFloat(hitter.hit_v_r) + bpHitVsR + bpSiVsR).toFixed(1),
        ob_v_r: obVsR.toFixed(1),
        tb_v_r: tbVsR.toFixed(1),
        hr_v_r: (parseFloat(hitter.hr_v_r) + bpHrVsR).toFixed(1),
        wopsVsL,
        wopsVsR,
    };
};

const withoutBPCalculations = (hitter) => {
    return {
        hit_v_l: `~${(parseFloat(hitter.hit_v_l) + hitter.bp_si_v_l).toFixed(1)}`,
        ob_v_l: `~${(parseFloat(hitter.ob_v_l) + hitter.bp_si_v_l).toFixed(1)}`,
        tb_v_l: `~${(parseFloat(hitter.tb_v_l) + hitter.bp_si_v_l).toFixed(1)}`,
        hr_v_l: `~${(parseFloat(hitter.hr_v_l)).toFixed(1)}/${hitter.bp_hr_v_l}`,
        hit_v_r: `~${(parseFloat(hitter.hit_v_r) + hitter.bp_si_v_r).toFixed(1)}`,
        ob_v_r: `~${(parseFloat(hitter.ob_v_r) + hitter.bp_si_v_r).toFixed(1)}`,
        tb_v_r: `~${(parseFloat(hitter.tb_v_r) + hitter.bp_si_v_r).toFixed(1)}`,
        hr_v_r: `~${(parseFloat(hitter.hr_v_r)).toFixed(1)}/${hitter.bp_hr_v_r}`,
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
            const partialTeams = hittersTeamsAndABPerTeam.filter(hp => hp.hitter === h.hitter_name);
            result = mainCalculations(h, partialTeams);
        } else {
            result = mainCalculations(h);
        }

        return {
            h_year: h.h_year,
            real_team: h.real_team,
            hitter_name: h.hitter_name,
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
