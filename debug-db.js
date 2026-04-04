require('dotenv').config();
console.log('DATABASE_URL from .env:', process.env.DATABASE_URL);
const { resolveDatabaseUrl } = require('./lib/database-url');
try {
    console.log('Resolved Database URL:', resolveDatabaseUrl());
} catch (e) {
    console.error('Error resolving:', e.message);
}
