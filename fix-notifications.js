const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    console.log('Fixing notification currencies...');
    const notifications = await prisma.notification.findMany({
        where: {
            message: { contains: '$' }
        }
    });

    for (const n of notifications) {
        const newMessage = n.message.replace('$', '') + ' EGP';
        await prisma.notification.update({
            where: { id: n.id },
            data: { message: newMessage }
        });
    }
    console.log(`Updated ${notifications.length} notifications.`);
    await prisma.$disconnect();
}

fix();
