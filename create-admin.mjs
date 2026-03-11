import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'prisma', 'dev.db').replace(/\\/g, '/');

console.log('DB Path:', `file:${dbPath}`);

const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@nexit.com' },
        update: {},
        create: {
            email: 'admin@nexit.com',
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('Admin user created/verified:', user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
