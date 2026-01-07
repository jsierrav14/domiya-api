import { Controller, Post, Body, Patch, Param, Headers } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string, // temporary until JWT
    @Body() dto: UpdatePackageStatusDto,
  ) {
    return this.packagesService.updateStatus(id, userId, dto);
  }
}
