import { IItem } from 'apps/order/src/interfaces/items.interface';
import { Document } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  item?: IItem[];
  customerId?: string;
  totalPrice?: string;
  paymentId?: string;
  paymentStatus?: boolean;
  createdDate?: Date;
  updatedDate?: Date;
}
