import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        process.env.DATABASE_URL || 'mongodb://localhost:27017/nest',
      ),
  },
];
