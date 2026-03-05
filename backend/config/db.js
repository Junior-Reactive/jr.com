const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

let pool;

async function connectDB() {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
        });

        // Test the connection
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();

        console.log('✅ PostgreSQL connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
}

function getPool() {
    if (!pool) throw new Error('Database not initialised. Call connectDB() first.');
    return pool;
}

module.exports = { connectDB, getPool };
