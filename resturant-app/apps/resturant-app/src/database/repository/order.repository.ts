import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { IOrder } from './interfaces/order.interface';

@Injectable()
export class OrderRepository {
  private LOGGER = new Logger(OrderRepository.name);
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: Model<IOrder>,
  ) {}

  async getAllOrders() {
    try {
      this.LOGGER.log(`Get all orders`);
      return this.orderModel.find({});
    } catch (error) {
      throw error;
    }
  }
}
