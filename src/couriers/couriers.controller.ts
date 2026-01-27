import { Controller, Get, UseGuards } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from '../users/types/jwt-user';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/types/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { Route } from '../routes/schema/route.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('couriers')
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @Roles(UserRole.REPARTIDOR)
  @Get('me/route')
  @ApiOkResponse({
    type: Route,
  })
  getMyRoute(@CurrentUser() user: JwtUser, date?: string): Promise<Route> {
    return this.couriersService.getMyActiveRoute(user.id, date);
  }
}
