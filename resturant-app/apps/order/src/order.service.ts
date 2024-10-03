import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateOrderRequest } from './requests/createOrder.request';
import { CreateOrderResponse } from './responses/CreateOrder.response';
import { UpdateOrderRequest } from './requests/updateOrder.request';
import { UpdateOrderResponse } from './responses/updateOrder.response';
import { OrderRepository } from './database/repository/order.repository';
import { IOrder } from './database/repository/interfaces/order.interface';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('PAYMENT_SERVICE')
    private readonly paymentServiceClient: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(order: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      this.logger.log('Receivie order ', JSON.stringify(order));
      const orderDoc = await this.orderRepository.create(order);
      const status: boolean = await this.communicateWithPaymentService(
        orderDoc.paymentId,
      );
      await this.orderRepository.updateById(
        { paymentStatus: status },
        orderDoc._id,
      );
      if (status) {
        return {
          status: HttpStatus.CREATED,
          message: `Order Created successfully with id ${orderDoc._id}`,
        };
      }
      await this.orderRepository.deleteOrder(orderDoc._id);
      throw new HttpException(
        `Please select another payment method`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async updateOrder(
    order: UpdateOrderRequest,
    id: string,
  ): Promise<UpdateOrderResponse> {
    try {
      await this.orderRepository.updateById(order, id);
      this.logger.log(`Receivie order ${id} to update`, JSON.stringify(order));
      return {
        status: HttpStatus.ACCEPTED,
        message: `Order Updated successfully`,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getOrders(customerId: string): Promise<IOrder[]> {
    try {
      this.logger.log(`Receivie get orders for customer ${customerId}`);
      const customerOrders: IOrder[] =
        await this.orderRepository.getOrdersByCustomerId(customerId);
      return customerOrders;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async communicateWithPaymentService(
    paymentId: string,
  ): Promise<boolean> {
    try {
      await this.paymentServiceClient.connect();
      this.logger.log('sending to payement service');
      const paymentResponse = await lastValueFrom(
        this.paymentServiceClient.send(
          { cmd: 'pay' },
          { paymentId: paymentId },
        ),
      );
      this.logger.debug(JSON.stringify(paymentResponse));
      return paymentResponse;
    } catch (error) {
      this.logger.error('Error While procceed Payment', error);
      if (error instanceof RpcException) {
        this.logger.error('RPC Error: ' + error.message);
      } else {
        this.logger.error('Unexpected error while processing payment', error);
      }
      throw error;
    }
  }
}
