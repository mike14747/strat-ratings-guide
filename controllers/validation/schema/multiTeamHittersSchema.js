const Joi = require('joi');

const multiTeamHittersSchema = Joi.array().items({
    Year: Joi.number().integer().min(1900).max(2050).required(),
    Name: Joi.string().min(3).required(),
    Bats: Joi.string().length(1).valid('L', 'S', 'R').required(),
    Tm: Joi.string().length(3).required(),
    AB: Joi.number().integer().min(0).required(),
});

module.exports = multiTeamHittersSchema;
