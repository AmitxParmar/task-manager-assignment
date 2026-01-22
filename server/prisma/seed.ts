import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Hash passwords
    const saltRounds = 12;
    const demoPassword = await bcrypt.hash('demo@demo', saltRounds);
    const testPassword = await bcrypt.hash('test@test', saltRounds);
    const johnPassword = await bcrypt.hash('johndoe@johndoe', saltRounds);

    // Create demo users
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@demo.com' },
        update: {},
        create: {
            email: 'demo@demo.com',
            name: 'Demo User',
            passwordHash: demoPassword,
        },
    });

    const testUser = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            name: 'Test User',
            passwordHash: testPassword,
        },
    });

    const johnUser = await prisma.user.upsert({
        where: { email: 'johndoe@johndoe.com' },
        update: {},
        create: {
            email: 'johndoe@johndoe.com',
            name: 'John Doe',
            passwordHash: johnPassword,
        },
    });

    console.log('✅ Created demo users:');
    console.log('   - demo@demo.com (password: demo@demo)');
    console.log('   - test@test.com (password: test@test)');
    console.log('   - johndoe@johndoe.com (password: johndoe@johndoe)');

    // Create some sample tasks
    const sampleTasks = [
        {
            title: 'Complete project documentation',
            description: 'Write comprehensive README and API documentation',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            creatorId: demoUser.id,
            assignedToId: demoUser.id,
        },
        {
            title: 'Review pull requests',
            description: 'Review and merge pending pull requests',
            priority: 'MEDIUM',
            status: 'TODO',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            creatorId: demoUser.id,
            assignedToId: testUser.id,
        },
        {
            title: 'Fix authentication bug',
            description: 'Resolve token refresh issue in production',
            priority: 'URGENT',
            status: 'TODO',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            creatorId: testUser.id,
            assignedToId: johnUser.id,
        },
        {
            title: 'Update dependencies',
            description: 'Update all npm packages to latest versions',
            priority: 'LOW',
            status: 'TODO',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            creatorId: johnUser.id,
            assignedToId: demoUser.id,
        },
        {
            title: 'Deploy to production',
            description: 'Deploy latest changes to production environment',
            priority: 'HIGH',
            status: 'REVIEW',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            creatorId: demoUser.id,
            assignedToId: testUser.id,
        },
    ];

    for (const taskData of sampleTasks) {
        await prisma.task.create({
            data: taskData,
        });
    }

    console.log(`✅ Created ${sampleTasks.length} sample tasks`);
    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
