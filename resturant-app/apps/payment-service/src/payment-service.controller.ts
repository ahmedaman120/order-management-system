import { Controller, Logger } from '@nestjs/common';
import { PaymentServiceService } from './payment-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentRequest } from './dto/payment.request';

@Controller()
export class PaymentServiceController {
  private logger = new Logger(PaymentServiceController.name);
  private customersPaymentMethodMocks = ['231', 'asd', 'wqe'];
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  getHello(): any {
    return 'Hello world';
  }

  @MessagePattern({ cmd: 'pay' })
  pay(data: PaymentRequest) {
    // return this.appService.pay(data);
    if (this.customersPaymentMethodMocks.includes(data.paymentId)) {
      return true;
    }
    return false;
  }

  @MessagePattern({ cmd: 'refund' })
  refund(data: any) {
    // return this.appService.all();
    return data;
  }
}
