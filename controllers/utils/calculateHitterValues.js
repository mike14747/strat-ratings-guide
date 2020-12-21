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

    let bpAdjVsR = 0;
    let bpSiAdjVsR = 0;
    let clAdjVsR = 0;

    // ballpark calculations vs Lefty pitchers
    if (hitter.bats === 'L') {
        // console.log(hitter.st_hr_l);
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

    const obVsL = parseFloat(hitter.ob_v_l) + bpObVsL + bpSiVsL;
    const tbVsL = parseFloat(hitter.tb_v_l) + bpTbVsL + bpSiVsL;
    const obVsR = parseFloat(hitter.ob_v_r) + bpObVsR + bpSiVsR;
    const tbVsR = parseFloat(hitter.tb_v_r) + bpTbVsR + bpSiVsR;

    // start wOPS calculations
    const wAdjVsL = hitter.w_v_l === 'w' ? 0.845 * 9 : 0;
    const wopsVsL = (((1.2 * obVsL) + (0.845 * tbVsL) - (1.2 * 20 * hitter.dp_v_l / 108)) - wAdjVsL).toFixed(1);
    const wAdjVsR = hitter.w_v_r === 'w' ? 0.845 * 9 : 0;
    const wopsVsR = (((1.2 * obVsR) + (0.845 * tbVsR) - (1.2 * 20 * hitter.dp_v_r / 108)) - wAdjVsR).toFixed(1);

    return {
        hit_v_l: (parseFloat(hitter.hit_v_l) + bpHitVsL + bpSiVsL).toFixed(1),
        ob_v_l: obVsL,
        tb_v_l: tbVsL,
        hr_v_l: (parseFloat(hitter.hr_v_l) + bpHrVsL).toFixed(1),
        hit_v_r: (parseFloat(hitter.hit_v_r) + bpHitVsR + bpSiVsR).toFixed(1),
        ob_v_r: obVsR,
        tb_v_r: tbVsR,
        hr_v_r: (parseFloat(hitter.hr_v_r) + bpHrVsR).toFixed(1),
        wopsVsL,
        wopsVsR,
    };
};

const mainCalculations = (hitter) => {
    if (hitter.real_team_id !== 1) {
        return ballparkCalculations(hitter);
    }
};

const calculateHitterValues = (hittersArr) => {
    const hittersCalculated = hittersArr.map((h, i) => {
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
            hit_v_l: result.hit_v_l,
            ob_v_l: result.ob_v_l.toFixed(1),
            tb_v_l: result.tb_v_l.toFixed(1),
            hr_v_l: result.hr_v_l,
            w_v_l: processWColumn(h.real_team_id, h.bp_hr_v_l, h.w_v_l, h.bp_si_v_l),
            dp_v_l: h.dp_v_l,
            wops_v_l: result.wopsVsL,
            so_v_r: h.so_v_r,
            bb_v_r: h.bb_v_r,
            hit_v_r: result.hit_v_r,
            ob_v_r: result.ob_v_r.toFixed(1),
            tb_v_r: result.tb_v_r.toFixed(1),
            hr_v_r: result.hr_v_r,
            w_v_r: processWColumn(h.real_team_id, h.bp_hr_v_r, h.w_v_r, h.bp_si_v_r),
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
            rml_team_name: h.rml_team_name,
        };
    });
    return hittersCalculated;
};

module.exports = calculateHitterValues;
