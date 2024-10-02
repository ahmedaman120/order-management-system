import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/grpc/proto/auth';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // connect with microservice module
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath:
        process.env.PROTO_FILE_PATH ||
        join(__dirname, '../../../libs/grpc/src/proto/auth.proto'),
      package: AUTH_PACKAGE_NAME,
      url: process.env.AUTH_MICROSERVICE_URL || '0.0.0.0:50011', // for development set it with localhost
    },
  });

  // validator config

  const validatorOptions = {
    whitelist: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      return new HttpException(errors, HttpStatus.NOT_ACCEPTABLE);
    },
  };
  app.useGlobalPipes(new ValidationPipe(validatorOptions));

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3001;
  // security configs
  const corsOptions = {
    origin: ['*', 'http://localhost:5173'], // Replace with your React app's URL
    credentials: true,
  };
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors(corsOptions);

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
