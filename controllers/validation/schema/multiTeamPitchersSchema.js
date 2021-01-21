const Joi = require('joi');

const multiTeamPitchersSchema = Joi.array().items({
    // Year,Name,Throws,Tm,IP
    Year: Joi.number().integer().min(1900).max(2050).required(),
    Name: Joi.string().min(3).required(),
    Throws: Joi.string().length(1).valid('L', 'S', 'R').required(),
    Tm: Joi.string().length(3).required(),
    IP: Joi.number().min(0).required(),
});

module.exports = multiTeamPitchersSchema;
