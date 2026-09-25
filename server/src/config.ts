import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'paradise_public_school_super_secure_jwt_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'paradise_public_school_refresh_token_secret_key_2026',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173,http://localhost:8081').split(','),
  databaseUrl: process.env.DATABASE_URL || ''
};
