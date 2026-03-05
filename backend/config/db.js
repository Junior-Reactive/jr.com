const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

let pool = null;

async function connectDB() {
    try {
        pool = await sql.connect(config);
        console.log('✅ Connected to Microsoft SQL Server');
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
}

function getPool() {
    if (!pool) {
        throw new Error('Database not initialised. Call connectDB() before making queries.');
    }
    return pool;
}

module.exports = { sql, connectDB, getPool };
