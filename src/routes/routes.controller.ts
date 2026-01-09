import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { AddPackagesDto } from './dto/add-packages.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/types/user-role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post(':id/packages')
  addPackages(@Param('id') id: string, @Body() dto: AddPackagesDto) {
    return this.routesService.addPackages(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.routesService.publish(id);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.routesService.close(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }
}
