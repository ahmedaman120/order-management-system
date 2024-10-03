import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { orderProvider } from './providers/order.provider';
import { OrderRepository } from './repository/order.repository';
import { reportProvider } from './providers/report.provider';
import { ReportRepository } from './repository/report.repository';

@Module({
  providers: [
    ...databaseProviders,
    ...orderProvider,
    ...reportProvider,
    OrderRepository,
    ReportRepository,
  ],
  exports: [
    ...databaseProviders,
    ...orderProvider,
    ...reportProvider,
    OrderRepository,
    ReportRepository,
  ],
})
export class DatabaseModule {}
