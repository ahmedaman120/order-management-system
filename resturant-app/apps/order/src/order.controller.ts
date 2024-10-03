import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequest } from './requests/createOrder.request';
import { UpdateOrderRequest } from './requests/updateOrder.request';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }

  @Post()
  async createOrder(@Body() order: CreateOrderRequest) {
    try {
      return this.orderService.createOrder(order);
    } catch (error) {
      throw error;
    }
  }

  @Patch('/:id')
  async updateOrder(
    @Body() order: UpdateOrderRequest,
    @Param('id') orderId: string,
  ) {
    try {
      return this.orderService.updateOrder(order, orderId);
    } catch (error) {
      throw error;
    }
  }

  @Get('/all')
  async getOrder(customerId: string) {
    try {
      return this.orderService.getOrders(customerId);
    } catch (error) {
      throw error;
    }
  }
}
