import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  daily(from: Date, to: Date) {
    return this.prisma.transaction.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: from,
          lte: to
        }
      },
      _sum: { amount: true }
    });
  }

  byCategory(from: Date, to: Date) {
    return this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: from,
          lte: to
        }
      },
      _sum: { amount: true }
    });
  }

  subscriptionsOverview() {
    return this.prisma.subscription.findMany({
      select: {
        id: true,
        name: true,
        amount: true,
        currency: true,
        intervalMonths: true,
        nextRunAt: true
      }
    });
  }
}
