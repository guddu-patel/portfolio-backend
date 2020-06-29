const Joi = require('@hapi/joi');

// register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
}

// login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}

// post create validation
const postValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        description: Joi.string().required(),
        slug: Joi.string().required(),
        post_image: Joi.string(),
        page_content: Joi.string(),
        category: Joi.string(),
    });

    return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;