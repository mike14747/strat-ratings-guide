import Joi from 'joi';

const usernameError = 'The "username" field must be alphnumeric and from 6 to 15 characters in length.';
const passwordError = 'The "password" field must consist of letters, numbers and some limited special characters and be from 8 to 20 characters in length.';

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(6).max(15).messages({
        'string.base': usernameError,
        'string.alphanum': usernameError,
        'string.min': usernameError,
        'string.max': usernameError,
    }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*()-+=]{8,20}$/).message(passwordError).required(),
});
