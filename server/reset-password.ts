import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient();

async function main() {
    const email = 'johndoe@johndoe.com';
    const newPassword = 'johndoe@johndoe';
    const saltRounds = 12;

    console.log(`Resetting password for ${email}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            return;
        }

        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        await prisma.user.update({
            where: { email },
            data: { passwordHash },
        });

        console.log(`Password reset successfully for ${email}.`);
    } catch (error) {
        console.error('Error in script:', error);
    }
}

main()
    .catch((e) => {
        console.error('Error resetting password:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
