import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import {
  Package,
  PackageDocument,
  PackageStatus,
} from './schema/package.schema';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';
import {
  Route,
  RouteDocument,
  RouteStatus,
} from '../routes/schema/route.schema';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
    @InjectModel(Route.name) private readonly routeModel: Model<RouteDocument>,
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

  async updateStatus(
    packageId: string,
    courierUserId: string,
    dto: UpdatePackageStatusDto,
  ) {
    if (!Types.ObjectId.isValid(packageId))
      throw new BadRequestException('Invalid package id');
    if (!Types.ObjectId.isValid(courierUserId))
      throw new BadRequestException('Invalid courier id');

    const pkg = await this.packageModel.findById(packageId);
    if (!pkg) throw new NotFoundException('Package not found');

    if (!pkg.routeId)
      throw new BadRequestException('Package is not assigned to a route');

    const route = await this.routeModel.findById(pkg.routeId);
    if (!route)
      throw new BadRequestException('Route not found for this package');

    const isActive = [RouteStatus.PUBLISHED, RouteStatus.IN_PROGRESS].includes(
      route.status,
    );
    if (!isActive) throw new BadRequestException('Route is not active');

    if (route.courierUserId.toString() !== courierUserId) {
      throw new ForbiddenException(
        'This package does not belong to your route',
      );
    }

    // Restrict allowed updates (recommended)
    const allowed = [
      PackageStatus.DELIVERED,
      PackageStatus.NOT_DELIVERED,
      PackageStatus.RETURNED,
    ];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Courier can only set status to: ${allowed.join(', ')}`,
      );
    }

    pkg.status = dto.status;

    // If you want to store reason/note, add fields or an events collection
    // pkg.lastNote = dto.note; pkg.lastReasonCode = dto.reasonCode;

    await pkg.save();
    return pkg;
  }
}
