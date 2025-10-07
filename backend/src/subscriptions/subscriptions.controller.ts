import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  list() {
    return this.subscriptionsService.list();
  }

  @Post()
  create(@Body() payload: CreateSubscriptionDto) {
    return this.subscriptionsService.create(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @Get(':id/forecast')
  forecast(@Param('id') id: string, @Query('months') months?: string) {
    return this.subscriptionsService.forecast(id, months ? Number(months) : undefined);
  }
}
