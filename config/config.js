const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'instagramNODE',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'caradepene',
  },
};

module.exports = config;
