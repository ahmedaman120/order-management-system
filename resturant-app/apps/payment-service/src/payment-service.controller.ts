import { Controller } from '@nestjs/common';
import { PaymentServiceService } from './payment-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  getHello(): any {
    return 'Hello world';
  }

  @MessagePattern({ cmd: 'pay' })
  pay(data: any) {
    // return this.appService.pay(data);
    return data;
  }

  @MessagePattern({ cmd: 'refund' })
  refund(data: any) {
    // return this.appService.all();
    return data;
  }
}
