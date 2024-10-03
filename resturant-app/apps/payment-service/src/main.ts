import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PaymentServiceModule } from './payment-service.module';

const logger = new Logger('Main');
async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3003,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: true,
      exceptionFactory: (errors) => {
        return new RpcException(errors);
      },
    }),
  );

  await app.listen();
  logger.log('Microservice Payment is listening');
}
bootstrap();
