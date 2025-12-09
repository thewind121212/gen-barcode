import "dotenv/config";
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { env } from "./env.js";
import { GeneralLogger, LogType, LogLevel } from "./utils/logger.js";

// Global singleton instance
let prisma: PrismaClient | null
let pool: Pool | null = null
let isFirstInitDone = false

/**
 * Get or create the Prisma Client singleton instance with connection pooling
 * This ensures only one instance exists across the entire application
 */
export const getPrisma = (): PrismaClient => {
    if (!prisma) {
        if (!isFirstInitDone) {
            GeneralLogger(LogType.INFRASTRUCTURE, LogLevel.INFO, "First Initializing Prisma Client")
            isFirstInitDone = true
        }
        const connectionString = env.DATABASE_URL;
        if (!connectionString) {
            GeneralLogger(LogType.INFRASTRUCTURE, LogLevel.ERROR, "DATABASE_URL environment variable is not set")
            throw new Error('Infrastructure error: DATABASE_URL environment variable is not set')
        }

        // Create a connection pool with optimal settings
        pool = new Pool({
            connectionString,
            // Connection pool configuration
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        })

        // Create Prisma adapter with the pool
        const adapter = new PrismaPg(pool)

        // Initialize Prisma Client with the adapter
        prisma = new PrismaClient({
            adapter,
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        })

        // Handle graceful shutdown
        const cleanup = async () => {
            GeneralLogger(LogType.INFRASTRUCTURE, LogLevel.INFO, "Shutting down Prisma Client")
            if (prisma) {
                await prisma.$disconnect()
                prisma = null
            }
            if (pool) {
                await pool.end()
                pool = null
            }
        }

        process.on('SIGINT', cleanup)
        process.on('SIGTERM', cleanup)
        process.on('beforeExit', cleanup)
    }

    GeneralLogger(LogType.INFRASTRUCTURE, LogLevel.DEBUG, "Prisma Client In Good State")

    return prisma
}

/**
 * Disconnect Prisma Client and close the connection pool
 * Useful for testing or manual cleanup
 */
export const disconnectPrisma = async () => {
    if (prisma) {
        await prisma.$disconnect()
        prisma = null
    }
    if (pool) {
        await pool.end()
        pool = null
    }
}


// Export getPrisma function - will only initialize when first called
export default getPrisma()