import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: {
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }) {
    return this.prisma.transaction.findMany({
      where: params.where,
      orderBy: params.orderBy,
      include: { category: true, merchant: true, account: true }
    });
  }

  create(data: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        date: new Date(data.date),
        type: data.type as TransactionType,
        description: data.description,
        categoryId: data.categoryId,
        merchantId: data.merchantId,
        accountId: data.accountId,
        tags: data.tags ?? [],
        notes: data.notes,
        exchangeRate: data.exchangeRate ?? null,
        userId: data.userId
      }
    });
  }

  update(id: string, data: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        tags: data.tags ?? undefined
      }
    });
  }

  delete(id: string) {
    return this.prisma.transaction.delete({
      where: { id }
    });
  }
}
