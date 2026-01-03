import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { AddStopsDto } from './dto/add-stops.dto';
import { Route, RouteDocument, RouteStatus } from './schema/route.schema';
import {
  Package,
  PackageDocument,
  PackageStatus,
} from 'src/packages/schema/package.schema';

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
      stops: [],
    });
    return route;
  }

  async addStops(routeId: string, dto: AddStopsDto) {
    const route = await this.routeModel.findById(routeId);
    if (!route) throw new NotFoundException('Route not found');

    if (route.status !== RouteStatus.DRAFT) {
      throw new BadRequestException('You can only add stops to a DRAFT route');
    }

    // Validate packages exist and are not in another active route
    const packageIds = dto.stops.map((s) => new Types.ObjectId(s.packageId));
    const packages = await this.packageModel.find({ _id: { $in: packageIds } });

    if (packages.length !== packageIds.length) {
      throw new BadRequestException('One or more packages do not exist');
    }

    // Ensure not assigned to other active routes (routeId set)
    const alreadyAssigned = packages.find(
      (p) => p.routeId && p.routeId.toString() !== routeId,
    );
    if (alreadyAssigned) {
      throw new BadRequestException(
        `Package already assigned to another route: ${alreadyAssigned._id.toString()}`,
      );
    }

    // Merge stops (avoid duplicates)
    const existingSet = new Set(route.stops.map((s) => s.packageId.toString()));
    for (const stop of dto.stops) {
      if (!existingSet.has(stop.packageId)) {
        route.stops.push({
          packageId: new Types.ObjectId(stop.packageId),
          sequence: stop.sequence,
          stopStatus: 'PENDING',
        });
      }
    }

    // Sort by sequence
    route.stops.sort((a, b) => a.sequence - b.sequence);

    await route.save();

    // Update packages with routeId + status
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

    if (!route.stops.length) {
      throw new BadRequestException('Cannot publish a route with no stops');
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
