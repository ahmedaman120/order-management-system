import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ReportRepository } from './database/repository/report.repository';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject() private reportRepository: ReportRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getReport(idx: string) {
    try {
      // Check if the report is in the cache
      const cachedReport: string | null = await this.cacheManager.get(idx);

      if (cachedReport) {
        // If cached, parse and return the cached report
        return JSON.parse(cachedReport);
      }
      const report = await this.reportRepository.getReport(idx);

      if (report && report.length > 0) {
        await this.cacheManager.set(
          report[0].idx,
          JSON.stringify(report),
          120000,
        );
      }
      return report;
    } catch (error) {
      throw error;
    }
  }
}
