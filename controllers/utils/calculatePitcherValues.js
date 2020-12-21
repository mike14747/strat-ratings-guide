const ballparkCalculations = (pitcher) => {
    let bpAdjVsL = 0;
    let bpSiAdjVsL = 0;
    let clAdjVsL = 0;
    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;
    let clAdjVsR = 0;

    // ballpark calculations vs Lefty pitchers
    if (pitcher.throws === 'L') {
        bpAdjVsL = ((pitcher.st_hr_l / 20) + 0.45) / 2;
        bpSiAdjVsL = 5 * ((pitcher.st_si_l + 8) / 40) - 2;
        clAdjVsL = 0.12 * pitcher.cl_v_l;
    } else if (pitcher.throws === 'R' || pitcher.throws === 'S') {
        bpAdjVsL = ((pitcher.st_hr_r / 20) + 0.45) / 2;
        bpSiAdjVsL = 5 * ((pitcher.st_si_r + 8) / 40) - 2;
        clAdjVsL = 0.12 * pitcher.cl_v_l;
    }
    if (pitcher.bp_si_v_l === 0) {
        bpSiAdjVsL = 0;
        clAdjVsL = 0;
    }
    const bpSiVsL = clAdjVsL + bpSiAdjVsL;
    const bpHrVsL = bpAdjVsL * pitcher.bp_hr_v_l;
    const bpHitVsL = bpHrVsL + pitcher.bp_si_v_l;
    const bpObVsL = bpHrVsL + pitcher.bp_si_v_l;
    const bpTbVsL = (4 * bpHrVsL) + pitcher.bp_si_v_l;

    // ballpark calculations vs Righty pitchers
    if (pitcher.throws === 'L' || pitcher.throws === 'S') {
        bpAdjVsR = ((pitcher.st_hr_l / 20) + 0.45) / 2;
        bpSiAdjVsR = 5 * ((pitcher.st_si_l + 8) / 40) - 2;
        clAdjVsR = 0.12 * pitcher.cl_v_r;
    } else if (pitcher.throws === 'R') {
        bpAdjVsR = ((pitcher.st_hr_r / 20) + 0.45) / 2;
        bpSiAdjVsR = 5 * ((pitcher.st_si_r + 8) / 40) - 2;
        clAdjVsR = 0.12 * pitcher.cl_v_r;
    }
    if (pitcher.bp_si_v_r === 0) {
        bpSiAdjVsR = 0;
        clAdjVsR = 0;
    }

    const bpSiVsR = clAdjVsR + bpSiAdjVsR;
    const bpHrVsR = bpAdjVsR * pitcher.bp_hr_v_r;
    const bpHitVsR = bpHrVsR + pitcher.bp_si_v_r;
    const bpObVsR = bpHrVsR + pitcher.bp_si_v_r;
    const bpTbVsR = (4 * bpHrVsR) + pitcher.bp_si_v_r;

    const obVsL = parseFloat(pitcher.ob_v_l) + bpObVsL + bpSiVsL;
    const tbVsL = parseFloat(pitcher.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(pitcher.ob_v_r) + bpObVsR + bpSiVsR;
    const tbVsR = parseFloat(pitcher.tb_v_r) + bpTbVsR + bpSiVsR;

    // start wOPS calculations
    const wAdjVsL = pitcher.w_v_l === 'w' ? 0.845 * 9 : 0;
    const wopsVsL = (((1.2 * obVsL) + (0.845 * tbVsL) - (1.2 * 20 * pitcher.dp_v_l / 108)) - wAdjVsL).toFixed(1);
    const wAdjVsR = pitcher.w_v_r === 'w' ? 0.845 * 9 : 0;
    const wopsVsR = (((1.2 * obVsR) + (0.845 * tbVsR) - (1.2 * 20 * pitcher.dp_v_r / 108)) - wAdjVsR).toFixed(1);

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
        hr_v_l: `~${(parseFloat(pitcher.hr_v_l)).toFixed(1)}`,
        hit_v_r: `~${(parseFloat(pitcher.hit_v_r) + pitcher.bp_si_v_r).toFixed(1)}`,
        ob_v_r: `~${(parseFloat(pitcher.ob_v_r) + pitcher.bp_si_v_r).toFixed(1)}`,
        tb_v_r: `~${(parseFloat(pitcher.tb_v_r) + pitcher.bp_si_v_r).toFixed(1)}`,
        hr_v_r: `~${(parseFloat(pitcher.hr_v_r)).toFixed(1)}`,
        wopsVsL: '',
        wopsVsR: '',
    };
};

const mainCalculations = (pitcher) => {
    if (pitcher.real_team_id !== 1) {
        return ballparkCalculations(pitcher);
    } else {
        return withoutBPCalculations(pitcher);
    }
};

const calculatePitcherValues = (pitchersArr) => {
    const PitchersCalculated = pitchersArr.map(p => {
        const result = mainCalculations(p);

        return {
            p_year: p.h_year,
            real_team: p.real_team,
            pitcher_name: p.pitcher_name,
            bats: p.bats,
            injury: p.injury,
            ab: p.ab,
            so_v_l: p.so_v_l,
            bb_v_l: p.bb_v_l,
            hit_v_l: result.hit_v_l,
            ob_v_l: result.ob_v_l,
            tb_v_l: result.tb_v_l,
            hr_v_l: result.hr_v_l,
            dp_v_l: p.dp_v_l,
            wops_v_l: result.wopsVsL,
            so_v_r: p.so_v_r,
            bb_v_r: p.bb_v_r,
            hit_v_r: result.hit_v_r,
            ob_v_r: result.ob_v_r,
            tb_v_r: result.tb_v_r,
            hr_v_r: result.hr_v_r,
            dp_v_r: p.dp_v_r,
            wops_v_r: result.wopsVsR,
            stealing: p.stealing,
            spd: p.spd,
            bunt: p.bunt,
            h_r: p.h_r,
            fielding: p.FIELD,
            rml_team_name: p.rml_team_name,
        };
    });
    return PitchersCalculated;
};

module.exports = calculatePitcherValues;
