import { Injectable } from '@nestjs/common';
import { addMonths } from 'date-fns';
import { PrismaService } from '../common/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.subscription.findMany({
      include: { category: true, merchant: true }
    });
  }

  create(payload: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        name: payload.name,
        amount: payload.amount,
        currency: payload.currency,
        intervalMonths: payload.intervalMonths,
        nextRunAt: new Date(payload.nextRunAt),
        userId: payload.userId,
        categoryId: payload.categoryId,
        merchantId: payload.merchantId,
        notes: payload.notes,
        autoRenew: payload.autoRenew ?? true
      }
    });
  }

  update(id: string, payload: UpdateSubscriptionDto) {
    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...payload,
        nextRunAt: payload.nextRunAt ? new Date(payload.nextRunAt) : undefined
      }
    });
  }

  remove(id: string) {
    return this.prisma.subscription.delete({ where: { id } });
  }

  async forecast(id: string, months = 6) {
    const subscription = await this.prisma.subscription.findUnique({ where: { id } });
    if (!subscription) {
      return [];
    }
    const occurrences: Array<{ runDate: Date; amount: number; currency: string }> = [];
    let nextRun = subscription.nextRunAt;
    for (let index = 0; index < months; index += 1) {
      occurrences.push({ runDate: nextRun, amount: subscription.amount.toNumber(), currency: subscription.currency });
      nextRun = addMonths(nextRun, subscription.intervalMonths);
    }
    return occurrences;
  }
}
