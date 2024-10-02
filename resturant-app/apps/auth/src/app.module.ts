import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { CsrfMiddleware } from './common/middlewares/csrf.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: join(__dirname, '../../../environment/auth/auth.env'),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
