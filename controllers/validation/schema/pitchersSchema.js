const Joi = require('joi');

const pitchersSchema = Joi.array().items({
    // Year,TM,real_team_id,PITCHERS,IP,SO_v_l,BB_v_l,HIT_v_l,OB_v_l,TB_v_l,HR_v_l,BP_v_l,DP_v_l,SO_v_r,BB_v_r,HIT_v_r,OB_v_r,TB_v_r,HR_v_r,BP_v_r,DP_v_r,HO,ENDURANCE,FIELD,BK,WP,BAT_B,STL,SPD,rml_team_id
    Year: Joi.number().integer().min(1900).max(2050).required(),
    TM: Joi.string().length(3).required(),
    real_team_id: Joi.optional(),
    PITCHERS: Joi.string().min(3).required(),
    IP: Joi.number().integer().min(1).required(),
    SO_v_l: Joi.number().integer().min(0).required(),
    BB_v_l: Joi.number().integer().min(0).required(),
    HIT_v_l: Joi.number().min(0).required(),
    OB_v_l: Joi.number().min(0).required(),
    TB_v_l: Joi.number().min(0).required(),
    HR_v_l: Joi.number().min(0).required(),
    BP_v_l: Joi.string().min(1).max(2).required(),
    DP_v_l: Joi.number().integer().min(0).required(),
    SO_v_r: Joi.number().integer().min(0).required(),
    BB_v_r: Joi.number().integer().min(0).required(),
    HIT_v_r: Joi.number().min(0).required(),
    OB_v_r: Joi.number().min(0).required(),
    TB_v_r: Joi.number().min(0).required(),
    HR_v_r: Joi.number().min(0).required(),
    BP_v_r: Joi.string().min(1).max(2).required(),
    DP_v_r: Joi.number().integer().min(0).required(),
    HO: Joi.number().integer().min(-6).max(9).required(),
    ENDURANCE: Joi.string().required(),
    FIELD: Joi.string().required(),
    BK: Joi.number().integer().min(0).max(20).required(),
    WP: Joi.number().integer().min(0).max(20).required(),
    BAT_B: Joi.string().length(5).required(),
    STL: Joi.string().valid('AAA', 'AA', 'A', 'B', 'C', 'D', 'E').required(),
    SPD: Joi.number().integer().min(0).required(),
    rml_team_id: Joi.optional(),
});

module.exports = pitchersSchema;
