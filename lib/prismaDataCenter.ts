import { PrismaClient } from '../generated/prisma';
import { createMssqlPrismaClient } from '@/lib/prisma';

const globalForDataCenterPrisma = global as unknown as {
  prismaDataCenter?: PrismaClient;
};

function getDataCenterPrismaClient(): PrismaClient {
  if (!globalForDataCenterPrisma.prismaDataCenter) {
    const url = process.env.DATACENTER_DATABASE_URL || '';
    globalForDataCenterPrisma.prismaDataCenter = createMssqlPrismaClient(
      url,
      'DATACENTER_DATABASE_URL'
    );
  }

  return globalForDataCenterPrisma.prismaDataCenter;
}

export const prismaDataCenter = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getDataCenterPrismaClient() as unknown as Record<PropertyKey, unknown>)[
      prop
    ];
  },
});
