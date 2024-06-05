import Joi from 'joi';

export const cardedPlayersSchema = Joi.array().items({
    year: Joi.number().integer().min(1900).max(2050).required(),
    abbrev_name: Joi.string().min(1).max(100).required(),
    full_name: Joi.string().min(1).max(100).required(),
    rml_team: Joi.string().min(1).max(100).required(),
    ip: Joi.number().integer().min(1).allow(null).required(),
    ab: Joi.number().integer().min(1).allow(null).required(),
});
