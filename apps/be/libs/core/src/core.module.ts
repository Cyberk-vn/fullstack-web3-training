import { ph } from '@app/helper/prisma.helper'
import { createKeyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module, Global } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [createKeyv(process.env.REDIS_URL, { namespace: process.env.REDIS_NAMESPACE }) as any],
          ttl: 30 * 1000, // default TTL 30 seconds
        }
      },
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          // log: ['query'],
        },
        middlewares: [
          ph.defaultPagingMiddleware(),
          // loggingMiddleware(),
        ],
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
