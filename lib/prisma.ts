import { PrismaClient } from '../generated/prisma';
import { PrismaMssql } from '@prisma/adapter-mssql';

// Helper to parse SQL Server connection string
function parseConnectionString(url: string) {
  const match = url.match(/sqlserver:\/\/([^:]+):([^;]+);(.*)/);
  if (!match) return null;
  const host = match[1];
  const port = parseInt(match[2], 10);
  const rest = match[3];

  const params: Record<string, string> = {};
  rest.split(';').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      params[key.trim()] = value.trim();
    }
  });

  return {
    server: host,
    port: port,
    database: params.database,
    user: params.user,
    password: params.password,
    options: {
      encrypt: params.encrypt !== 'DANGER_PLAINTEXT' && params.encrypt !== 'false',
      trustServerCertificate: params.trustServerCertificate === 'true',
    }
  };
}

export function createMssqlPrismaClient(
  url: string,
  environmentVariable: string
): PrismaClient {
  const config = parseConnectionString(url);
  if (!config) {
    throw new Error(`${environmentVariable} is not set or invalid`);
  }

  const adapter = new PrismaMssql(config);
  return new PrismaClient({
    adapter,
    ...(process.env.NODE_ENV === 'development'
      ? { log: ['query', 'error', 'warn'] }
      : {}),
  });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function hasRequiredDelegates(client: PrismaClient): boolean {
  const runtimeClient = client as PrismaClient & {
    tbCustPointGoldCurrent2017?: unknown;
    tbCustPointSilverCurrent2017?: unknown;
    tbCustPointSilverCashCurrent?: unknown;
    tbCustGoldToAdjust?: unknown;
  };

  return Boolean(
    runtimeClient.tbCustPointGoldCurrent2017
    && runtimeClient.tbCustPointSilverCurrent2017
    && runtimeClient.tbCustPointSilverCashCurrent
    && runtimeClient.tbCustGoldToAdjust
  );
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma || !hasRequiredDelegates(globalForPrisma.prisma)) {
    const url = process.env.DATABASE_URL || '';
    globalForPrisma.prisma = createMssqlPrismaClient(url, 'DATABASE_URL');
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrismaClient() as unknown as Record<PropertyKey, unknown>)[prop];
  },
});
