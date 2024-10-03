import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportRepository } from './database/repository/report.repository';

@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);

  constructor(@Inject() private readonly reportRepository: ReportRepository) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateReportCron() {
    const today = new Date();

    const startOfDay = new Date();
    startOfDay.setDate(today.getDate() - 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setDate(today.getDate() - 1);
    endOfDay.setHours(23, 59, 59, 999);
    this.logger.debug('Called every Day at midnight');
    try {
      await this.reportRepository.getReportForPeriod(startOfDay, endOfDay);
    } catch (error) {
      this.logger.error(
        `Error while running Report Generator ${JSON.stringify(error)}`,
      );
    }
  }
}
