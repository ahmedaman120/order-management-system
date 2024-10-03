import { Connection } from 'mongoose';
import { OrderSchema } from '../schema/order.schema';

export const orderProvider = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ORDER', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
