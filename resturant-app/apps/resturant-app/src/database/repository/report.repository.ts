import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { IOrder } from './interfaces/order.interface';
import { IReport } from './interfaces/report.interface';

@Injectable()
export class ReportRepository {
  private LOGGER = new Logger(ReportRepository.name);
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: Model<IOrder>,
    @Inject('REPORT_MODEL') private readonly reportModel: Model<IReport>,
  ) {}

  async getReportForPeriod(from: Date, to: Date) {
    try {
      this.LOGGER.debug(`${from} ${to}`);
      const result = await this.orderModel.aggregate([
        {
          $match: {
            createdDate: {
              $gte: from, // From date
              $lt: to, // To date
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            countOfOrders: { $sum: 1 },
            countOfItems: { $sum: { $size: '$items' } },
          },
        },
        {
          $project: {
            _id: 0,
            totalRevenue: { $ifNull: ['$totalRevenue', 0] },
            countOfOrders: { $ifNull: ['$countOfOrders', 0] },
            countOfItems: { $ifNull: ['$countOfItems', 0] },
          },
        },
      ]);
      this.LOGGER.debug(`Get all Results ${result}`);
      const report = await this.reportModel.updateOne(
        { idx: from.toISOString().split('T')[0] },
        {
          idx: from.toISOString().split('T')[0],
          totalRevenue: result[0].totalRevenue,
          countOfItems: result[0].countOfItems,
          countOfOrders: result[0].countOfOrders,
        },
        { upsert: true },
      );
      this.LOGGER.log(`Get all Reports ${report}`);
      return report;
    } catch (error) {
      throw error;
    }
  }

  async getReport(idx: string) {
    try {
      const report = await this.reportModel.find({ idx });
      this.LOGGER.debug(`report ${JSON.stringify(report)}`);
      if (report.length == 0) {
        const today = new Date();

        const startOfDay = new Date();
        startOfDay.setDate(today.getDate());
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setDate(today.getDate());
        endOfDay.setHours(23, 59, 59, 999);
        await this.getReportForPeriod(startOfDay, endOfDay);
      }
      return report;
    } catch (error) {
      this.LOGGER.error(`error while find report`);
      throw error;
    }
  }
}
