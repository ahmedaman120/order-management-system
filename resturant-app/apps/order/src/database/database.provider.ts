import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      new Logger('DATABASE_CONNECTION').log('DB Connected');
      return mongoose.connect(
        process.env.DATABASE_URL || 'mongodb://localhost:27017/nest',
      );
    },
  },
];
