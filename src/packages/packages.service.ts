// src/packages/packages.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import {
  Package,
  PackageDocument,
  PackageStatus,
} from './schema/package.schema';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
  ) {}

  async create(dto: CreatePackageDto) {
    const exists = await this.packageModel.exists({
      trackingCode: dto.trackingCode,
    });

    if (exists) {
      throw new ConflictException('Tracking code already exists');
    }

    const pkg = new this.packageModel({
      trackingCode: dto.trackingCode,
      customerName: dto.customerName,
      phone: dto.phone,
      addressText: dto.addressText,
      status: PackageStatus.CREATED,
    });

    return pkg.save();
  }
}
