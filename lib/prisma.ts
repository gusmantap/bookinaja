import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ]
      : ['error'],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Log query performance in development
if (process.env.NODE_ENV === 'development') {
  globalThis.prismaGlobal = prisma;

  prisma.$on('query' as never, (e: any) => {
    console.log(`[Prisma Query] ${e.query}`);
    console.log(`[Prisma Params] ${e.params}`);
    console.log(`[Prisma Duration] ${e.duration}ms`);
  });
}
