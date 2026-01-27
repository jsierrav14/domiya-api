import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Route,
  RouteDocument,
  RouteStatus,
} from '../routes/schema/route.schema';

function todayYYYYMMDD(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

@Injectable()
export class CouriersService {
  constructor(
    @InjectModel(Route.name) private readonly routeModel: Model<RouteDocument>,
  ) {}

  async getMyActiveRoute(courierUserId: string, date?: string): Promise<Route> {
    if (!Types.ObjectId.isValid(courierUserId)) {
      throw new BadRequestException('Invalid courier user id');
    }

    const targetDate = date ?? todayYYYYMMDD();

    const route = await this.routeModel
      .findOne({
        courierUserId: new Types.ObjectId(courierUserId),
        date: targetDate,
        status: { $in: [RouteStatus.PUBLISHED, RouteStatus.IN_PROGRESS] },
      })
      .sort({ updatedAt: -1 }) // if multiple, pick latest
      .populate('packages.packageId') // packages data
      .lean();

    if (!route) {
      throw new NotFoundException(
        'No active route found for this courier today',
      );
    }

    return route;
  }
}
