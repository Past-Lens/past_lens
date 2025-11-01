import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateSlug(title: string): Promise<string> {
    // Convert to lowercase and replace spaces with hyphens
    let slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

    // Check if slug exists
    const existing = await prisma.artifact.findUnique({
        where: { slug },
    });

    if (!existing) {
        return slug;
    }

    // If slug exists, append a number
    let count = 1;
    let newSlug = `${slug}-${count}`;

    while (true) {
        const exists = await prisma.artifact.findUnique({
            where: { slug: newSlug },
        });

        if (!exists) {
            return newSlug;
        }

        count++;
        newSlug = `${slug}-${count}`;
    }
}
