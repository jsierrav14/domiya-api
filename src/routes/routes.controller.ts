import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { AddPackagesDto } from './dto/add-packages.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Post(':id/packages')
  addPackages(@Param('id') id: string, @Body() dto: AddPackagesDto) {
    return this.routesService.addPackages(id, dto);
  }
  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.routesService.publish(id);
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.routesService.close(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }
}
