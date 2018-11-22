const config = {
  app: {
    port: process.env.PORT || 3000,
    jwt: process.env.JWT_SECRET || 'm1cl4v353cr374',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'instagramNODE',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'caradepene',
  },
};

module.exports = config;
