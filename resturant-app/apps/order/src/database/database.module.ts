import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { orderProvider } from './providers/order.provider';
import { OrderRepository } from './repository/order.repository';

@Module({
  providers: [...databaseProviders, ...orderProvider, OrderRepository],
  exports: [...databaseProviders, ...orderProvider, OrderRepository],
})
export class DatabaseModule {}
