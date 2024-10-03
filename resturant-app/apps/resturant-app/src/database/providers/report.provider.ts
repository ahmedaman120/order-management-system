import { Connection } from 'mongoose';
import { ReportSchema } from '../schema/report.schema';

export const reportProvider = [
  {
    provide: 'REPORT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('REPORT', ReportSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
