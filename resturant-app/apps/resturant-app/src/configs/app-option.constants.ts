import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST') || '127.0.0.1',
        port: parseInt(configService.get<string>('REDIS_PORT')!) || 6440,
      },
    });
    await store.set('test', 'test', {}, (t) => {
      console.log(t);
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
