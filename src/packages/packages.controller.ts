import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/types/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtUser } from '../users/types/jwt-user';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ListPackagesQueryDto } from './dto/list-packages-query.dto';
import { Package, PackageStatus } from './schema/package.schema';
import { ApiOkResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Post()
  @ApiOkResponse({
    type: Package,
    description: 'Package created successfully',
  })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO, UserRole.REPARTIDOR)
  @Patch(':id/status')
  @ApiOkResponse({
    type: Package,
    description: 'Package status updated successfully',
  })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdatePackageStatusDto,
  ) {
    return this.packagesService.updateStatus(id, user, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Get()
  @ApiOkResponse({
    type: [Package],
    description: 'List of packages',
  })
  list(@Query() q: ListPackagesQueryDto) {
    console.log('🚀 ~ PackagesController ~ list ~ q:', q);
    return this.packagesService.list(q);
  }

  @Roles(UserRole.ADMIN, UserRole.DESPACHO)
  @Get('unassigned')
  @ApiOkResponse({
    type: [Package],
    description: 'List of unassigned packages',
  })
  unassigned(@Query() q: ListPackagesQueryDto) {
    return this.packagesService.list({ ...q, status: PackageStatus.CREATED });
  }
}
