import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { PaymentServiceModule } from './payment-service.module';

const logger = new Logger('Main');
async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3002,
    },
  });
  await app.listen();
  logger.log('Microservice Payment is listening');
}
bootstrap();
