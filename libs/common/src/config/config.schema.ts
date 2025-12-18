import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database
  POSTGRES_HOST: Joi.string().default('localhost'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().default(false),
  POSTGRES_LOGGING: Joi.boolean().default(false),
  POSTGRES_MIGRATIONS_RUN: Joi.boolean().default(false),
  POSTGRES_RETRY_ATTEMPTS: Joi.number().default(10),
  POSTGRES_RETRY_DELAY: Joi.number().default(3000),

  // JWT
  JWT_SECRET: Joi.string().required(),
});
