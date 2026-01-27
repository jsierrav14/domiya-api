import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { AddPackagesDto } from './dto/add-packages.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/types/user-role.enum';
import { ApiOkResponse } from '@nestjs/swagger';
import { Route } from './schema/route.schema';
import { RoutePackageStats } from './dto/route-package-stats.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post()
  @ApiOkResponse({
    type: Route,
    description: 'Route created successfully',
  })
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post(':id/packages')
  @ApiOkResponse({
    type: Route,
    description: 'Packages added to route successfully',
  })
  addPackages(@Param('id') id: string, @Body() dto: AddPackagesDto) {
    return this.routesService.addPackages(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post(':id/publish')
  @ApiOkResponse({
    type: Route,
    description: 'Route published successfully',
  })
  publish(@Param('id') id: string) {
    return this.routesService.publish(id);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post(':id/close')
  @ApiOkResponse({
    type: Route,
    description: 'Route closed successfully',
  })
  close(@Param('id') id: string) {
    return this.routesService.close(id);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Route,
    description: 'Route retrieved successfully',
  })
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Get('statistics/all')
  @ApiOkResponse({
    type: [RoutePackageStats],
    description: 'Route statistics',
  })
  getStatistics() {
    return this.routesService.getRouteStatistics();
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Get(':id/statistics')
  @ApiOkResponse({
    type: RoutePackageStats,
    description: 'Statistics for a specific route',
  })
  getRouteStatistics(@Param('id') id: string) {
    return this.routesService.getRouteStatistics(id);
  }
}
