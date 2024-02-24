const prismaClientSingleton = () => {
    return new PrismaClient();
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;