import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentRequest {
  @IsNotEmpty()
  @IsString()
  paymentId: string;
}
