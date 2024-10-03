import { IsArray, IsNumber, IsString } from 'class-validator';
import { IItem } from '../interfaces/items.interface';

export class CreateOrderRequest {
  @IsString()
  customerId: string;

  @IsString()
  paymentId: string;

  @IsArray()
  items: IItem[];

  @IsNumber()
  totalPrice: number;
}
