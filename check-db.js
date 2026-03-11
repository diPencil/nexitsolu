const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log('--- Checking DB ---');
    const products = await prisma.product.findMany({
        take: 5,
        select: { id: true, name: true }
    });
    console.log('Available IDs:', products.map(p => p.id));
    
    const target = 'CMMK9PMVQ0008ESK6EGMLQX83';
    const exists = await prisma.product.findUnique({ where: { id: target } });
    console.log(`Searching for: ${target}`);
    console.log('Exists:', !!exists);
    
    await prisma.$disconnect();
}

check();
