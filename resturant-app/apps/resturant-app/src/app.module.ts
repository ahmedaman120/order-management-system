import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AUTH_PACKAGE_NAME, RPC_AUTH_SERVICE_NAME } from '@app/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportGeneratorService } from './report-generator.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { RedisOptions } from './configs/app-option.constants';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: RPC_AUTH_SERVICE_NAME,
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath:
              process.env.PROTO_FILE_PATH ||
              join(__dirname, '../../../libs/grpc/src/proto/auth.proto'),
            url: process.env.AUTH_MICROSERVICE_URL || '0.0.0.0:50011',
          },
        }),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ReportGeneratorService],
})
export class AppModule {}
