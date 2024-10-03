import { Document } from 'mongoose';

export interface IReport extends Document {
  _id: string;
  idx: string;
  totalRevenue?: number;
  countOfOrders?: number;
  countOfItems?: number;
  createdDate?: Date;
  updatedDate?: Date;
}
