const Joi = require('joi');

const hittersSchema = Joi.array().items({
    Year: Joi.number().integer().min(1900).max(2050).required(),
    TM: Joi.string().length(3).required(),
    real_team_id: Joi.optional(),
    HITTERS: Joi.string().min(3).required(),
    INJ: Joi.optional(),
    AB: Joi.number().integer().min(1).required(),
    SO_v_lhp: Joi.number().integer().min(0).required(),
    BB_v_lhp: Joi.number().integer().min(0).required(),
    HIT_v_lhp: Joi.number().min(0).required(),
    OB_v_lhp: Joi.number().min(0).required(),
    TB_v_lhp: Joi.number().min(0).required(),
    HR_v_lhp: Joi.number().min(0).required(),
    BP_v_lhp: Joi.string().min(1).max(2).required(),
    CL_v_lhp: Joi.number().integer().required(),
    DP_v_lhp: Joi.number().integer().min(0).required(),
    SO_v_rhp: Joi.number().integer().min(0).required(),
    BB_v_rhp: Joi.number().integer().min(0).required(),
    HIT_v_rhp: Joi.number().min(0).required(),
    OB_v_rhp: Joi.number().min(0).required(),
    TB_v_rhp: Joi.number().min(0).required(),
    HR_v_rhp: Joi.number().min(0).required(),
    BP_v_rhp: Joi.string().min(1).max(2).required(),
    CL_v_rhp: Joi.number().integer().required(),
    DP_v_rhp: Joi.number().integer().min(0).required(),
    STEALING: Joi.string().required(),
    STL: Joi.string().valid('AAA', 'AA', 'A', 'B', 'C', 'D', 'E').required(),
    SPD: Joi.number().integer().min(0).required(),
    B: Joi.string().required(),
    H: Joi.string().required(),
    d_CA: Joi.string().length(3).allow('').required(),
    d_1B: Joi.string().length(3).allow('').required(),
    d_2B: Joi.string().length(3).allow('').required(),
    d_3B: Joi.string().length(3).allow('').required(),
    d_SS: Joi.string().length(3).allow('').required(),
    d_LF: Joi.string().length(3).allow('').required(),
    d_CF: Joi.string().length(3).allow('').required(),
    d_RF: Joi.string().length(3).allow('').required(),
    FIELDING: Joi.string().allow('').required(),
    rml_team_id: Joi.optional(),
});

module.exports = hittersSchema;
