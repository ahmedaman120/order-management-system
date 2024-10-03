import * as mongoose from 'mongoose';

export const ReportSchema = new mongoose.Schema({
  totalRevenue: Number,
  countOfOrders: Number,
  countOfItems: Number,
  idx: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
  updatedDate: {
    type: Date,
    default: new Date(),
  },
});

ReportSchema.index({ idx: 1 });
