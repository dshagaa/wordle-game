import * as Joi from '@hapi/joi';

const EnvironmentValidator = {
  validate() {
    return Joi.object({
      APP_NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .required(),
      APP_HOST: Joi.string().required(),
      APP_PORT: Joi.number().required(),
      DB_TYPE: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
    });
  },
};

export { EnvironmentValidator };
