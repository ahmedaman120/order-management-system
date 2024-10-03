import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/report/:idx')
  async getReport(@Param('idx') idx: string) {
    try {
      return this.appService.getReport(idx);
    } catch (error) {
      throw error;
    }
  }
}
