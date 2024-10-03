import { PartialType } from '@nestjs/swagger';
import { CreateOrderRequest } from './createOrder.request';

export class UpdateOrderRequest extends PartialType(CreateOrderRequest) {
  paymentStatus?: boolean;
}
