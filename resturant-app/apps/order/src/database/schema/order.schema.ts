import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  items: Array,
  customerId: String,
  totalPrice: Number,
  paymentId: String,
  paymentStatus: Boolean,
  createdDate: {
    type: Date,
    default: new Date(),
  },
  updatedDate: {
    type: Date,
    default: new Date(),
  },
});
