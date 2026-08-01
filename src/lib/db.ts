import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set with an absolute path for production standalone builds
// SQLite relative paths are resolved relative to the Prisma schema location,
// not the CWD, which causes issues in standalone builds.
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(process.cwd(), 'db', 'custom.db')
  process.env.DATABASE_URL = `file:${dbPath}`
  console.log('[DB] Using default DATABASE_URL:', process.env.DATABASE_URL)
} else if (process.env.DATABASE_URL.startsWith('file:./') || process.env.DATABASE_URL.startsWith('file:..')) {
  // Convert relative paths to absolute paths
  const relativePath = process.env.DATABASE_URL.replace('file:', '')
  const absolutePath = path.resolve(process.cwd(), relativePath)
  process.env.DATABASE_URL = `file:${absolutePath}`
  console.log('[DB] Resolved DATABASE_URL to absolute path:', process.env.DATABASE_URL)
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db