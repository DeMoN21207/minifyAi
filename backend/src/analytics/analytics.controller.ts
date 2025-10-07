import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('daily')
  daily(@Query('from') from: string, @Query('to') to: string) {
    return this.analyticsService.daily(new Date(from), new Date(to));
  }

  @Get('category-sum')
  byCategory(@Query('from') from: string, @Query('to') to: string) {
    return this.analyticsService.byCategory(new Date(from), new Date(to));
  }

  @Get('subscriptions-overview')
  subscriptionsOverview() {
    return this.analyticsService.subscriptionsOverview();
  }
}
