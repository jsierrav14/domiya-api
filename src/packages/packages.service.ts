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
import { JwtUser } from '../users/types/jwt-user';
import { UserRole } from '../users/types/user-role.enum';

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
    user: JwtUser,
    dto: UpdatePackageStatusDto,
  ) {
    if (!Types.ObjectId.isValid(packageId)) {
      throw new BadRequestException('Invalid package id');
    }

    const pkg = await this.packageModel.findById(packageId);
    if (!pkg) throw new NotFoundException('Package not found');

    const allowedStatuses = [
      PackageStatus.DELIVERED,
      PackageStatus.NOT_DELIVERED,
      PackageStatus.RETURNED,
    ];

    if (!allowedStatuses.includes(dto.status)) {
      throw new BadRequestException('Invalid status transition');
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.DESPACHO) {
      pkg.status = dto.status;
      await pkg.save();
      return pkg;
    }

    // ✅ CASE 2: REPARTIDOR → strict ownership rules
    if (user.role === UserRole.REPARTIDOR) {
      if (!pkg.routeId) {
        throw new BadRequestException('Package is not assigned to a route');
      }

      const route = await this.routeModel.findById(pkg.routeId);
      if (!route) throw new BadRequestException('Route not found');

      const activeStatuses = [RouteStatus.PUBLISHED, RouteStatus.IN_PROGRESS];
      if (!activeStatuses.includes(route.status)) {
        throw new BadRequestException('Route is not active');
      }

      if (route.courierUserId.toString() !== user.id) {
        throw new ForbiddenException(
          'This package does not belong to your route',
        );
      }

      pkg.status = dto.status;
      await pkg.save();
      return pkg;
    }

    throw new ForbiddenException('Role not allowed');
  }
}
