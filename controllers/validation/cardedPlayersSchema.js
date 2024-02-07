const Joi = require('joi');

const cardedPlayersSchema = Joi.array().items({
    year: Joi.number().integer().min(1900).max(2050).required(),
    fullName: Joi.string().min(1).max(100).required(),
    rmlTeam: Joi.string().min(1).max(100).required(),
    ip: Joi.number().integer().min(1).allow(null).required(),
    ab: Joi.number().integer().min(1).allow(null).required(),
    abbrevName: Joi.string().min(1).max(100).required(),
});

module.exports = cardedPlayersSchema;
