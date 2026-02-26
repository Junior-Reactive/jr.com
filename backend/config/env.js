const dotenv = require('dotenv');
dotenv.config();

const requiredEnv = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_DATABASE'];
const missing = requiredEnv.filter(key => !process.env[key]);

if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

module.exports = {
    port: process.env.PORT || 5000,
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};