import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: ['query', 'error', 'warn'],
});

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

export default prisma;