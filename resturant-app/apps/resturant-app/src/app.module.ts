import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AUTH_PACKAGE_NAME, RPC_AUTH_SERVICE_NAME } from '@app/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
