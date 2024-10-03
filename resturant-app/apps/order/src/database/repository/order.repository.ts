import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { IOrder } from './interfaces/order.interface';
import { CreateOrderRequest } from '../../requests/createOrder.request';
import { UpdateOrderRequest } from '../../requests/updateOrder.request';

@Injectable()
export class OrderRepository {
  private LOGGER = new Logger(OrderRepository.name);
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: Model<IOrder>,
  ) {}

  async getOrdersByCustomerId(customerId: string) {
    try {
      this.LOGGER.log(`Get Customer ${customerId} orders`);
      return this.orderModel.find({ customerId });
    } catch (error) {
      throw error;
    }
  }
  async create(order: CreateOrderRequest) {
    try {
      const orderDoc = await this.orderModel.create(order);
      this.LOGGER.log(`Inserting order successfully ${orderDoc}`);
      return orderDoc;
    } catch (error: any) {
      this.LOGGER.error('error while inserting in DB');
      throw error;
    }
  }

  async updateById(order: UpdateOrderRequest, orderId: string) {
    try {
      await this.orderModel.findOneAndUpdate({ _id: orderId }, order);
      this.LOGGER.log(
        `updated order ${orderId} with these values ${order} get succeed`,
      );
    } catch (error: any) {
      this.LOGGER.error('Error while updating order ' + error);
      throw error;
    }
  }

  async deleteOrder(orderId: string) {
    try {
      await this.orderModel.findByIdAndDelete(orderId);
    } catch (error) {
      throw error;
    }
  }
}
