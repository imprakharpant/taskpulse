const dotenv = require('dotenv');
const { z } = require('zod');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required' })
    .min(1, 'DATABASE_URL cannot be empty'),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET is required' })
    .min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_EXPIRES_IN: z
    .string()
    .default('1d'),
  CORS_ORIGIN: z
    .string()
    .default('*')
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:');
    result.error.errors.forEach((err) => {
      console.error(`- ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }

  return result.data;
};

const env = parseEnv();

module.exports = env;
