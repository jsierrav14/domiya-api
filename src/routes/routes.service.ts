import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route, RouteDocument, RouteStatus } from './schema/route.schema';
import {
  Package,
  PackageDocument,
  PackageStatus,
} from 'src/packages/schema/package.schema';
import { AddPackagesDto } from './dto/add-packages.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private readonly routeModel: Model<RouteDocument>,
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
  ) {}

  async create(dto: CreateRouteDto) {
    const route = await this.routeModel.create({
      date: dto.date,
      shift: dto.shift,
      courierUserId: new Types.ObjectId(dto.courierUserId),
      status: RouteStatus.DRAFT,
      packages: [],
    });
    return route;
  }

  async addPackages(routeId: string, dto: AddPackagesDto) {
    const route = await this.routeModel.findById(routeId);
    if (!route) throw new NotFoundException('Route not found');

    if (route.status !== RouteStatus.DRAFT) {
      throw new BadRequestException(
        'You can only add packages to a DRAFT route',
      );
    }

    const packageIds = dto.packages.map((p) => new Types.ObjectId(p.packageId));
    const packages = await this.packageModel.find({ _id: { $in: packageIds } });

    if (packages.length !== packageIds.length) {
      throw new BadRequestException('One or more packages do not exist');
    }

    // Block packages already assigned to another route
    const alreadyAssigned = packages.find(
      (p) => p.routeId && p.routeId.toString() !== routeId,
    );
    if (alreadyAssigned) {
      throw new BadRequestException(`Package already assigned`);
    }

    // SIMPLE MVP: replace route.packages entirely (easy + predictable)
    route.packages = dto.packages.map((p) => ({
      packageId: new Types.ObjectId(p.packageId),
      sequence: p.sequence,
    }));

    route.packages.sort((a, b) => a.sequence - b.sequence);
    await route.save();

    await this.packageModel.updateMany(
      { _id: { $in: packageIds } },
      { $set: { routeId: route._id, status: PackageStatus.ASSIGNED } },
    );

    return route;
  }

  async publish(routeId: string) {
    const route = await this.routeModel.findById(routeId);
    if (!route) throw new NotFoundException('Route not found');

    if (route.status !== RouteStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT routes can be published');
    }

    if (!route.packages.length) {
      throw new BadRequestException('Cannot publish a route with no packages');
    }

    route.status = RouteStatus.PUBLISHED;
    await route.save();

    return route;
  }

  async findOne(routeId: string) {
    const route = await this.routeModel
      .findById(routeId)
      .populate('courierUserId', 'firstName lastName role')
      .populate('stops.packageId'); // includes address, status, etc.

    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async close(routeId: string) {
    const route = await this.routeModel.findById(routeId);
    if (!route) throw new NotFoundException('Route not found');

    if (route.status === RouteStatus.CLOSED) return route;

    route.status = RouteStatus.CLOSED;
    await route.save();

    // Optionally unassign remaining packages (depends on your business rules)
    // Here we keep package.routeId for audit; if you prefer to clear it, do updateMany.

    return route;
  }
}
