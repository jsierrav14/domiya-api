import { Controller, Get, Headers, Query } from '@nestjs/common';
import { CouriersService } from './couriers.service';

@Controller('couriers')
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @Get('me/route')
  getMyRoute(
    @Headers('x-user-id') userId: string,
    @Query('date') date?: string,
  ) {
    return this.couriersService.getMyActiveRoute(userId, date);
  }
}
