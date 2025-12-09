import "dotenv/config";
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { env } from "./env.js";

// Global singleton instance
let prisma: PrismaClient | null
let pool: Pool | null = null

/**
 * Get or create the Prisma Client singleton instance with connection pooling
 * This ensures only one instance exists across the entire application
 */
export const getPrisma = (): PrismaClient => {
    if (!prisma) {
        console.log('hit')
        const connectionString = env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is not set')
        }

        // Create a connection pool with optimal settings
        pool = new Pool({
            connectionString,
            // Connection pool configuration
            max: 20,                // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
            connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
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