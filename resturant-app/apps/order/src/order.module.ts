import { Logger, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RPC_AUTH_SERVICE_NAME, AUTH_PACKAGE_NAME } from '@app/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtGuard } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
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
      {
        name: 'PAYMENT_SERVICE',
        useFactory: () => {
          new Logger('PAYMENT_SERVICE').log('Payment service client created');
          return {
            transport: Transport.TCP,
            options: {
              port: 3003,
              host: '127.0.0.1',
            },
          };
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
