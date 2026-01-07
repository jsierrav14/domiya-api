import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RouteDocument = HydratedDocument<Route>;

export enum RouteStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

@Schema({ _id: false })
export class RoutePackage {
  @Prop({ type: Types.ObjectId, ref: 'Package', required: true })
  packageId: Types.ObjectId;

  @Prop({ required: true })
  sequence: number;
}
export const RoutePackageSchema = SchemaFactory.createForClass(RoutePackage);

@Schema({ timestamps: true })
export class Route {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  shift: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  courierUserId: Types.ObjectId;

  @Prop({
    type: String,
    enum: RouteStatus,
    default: RouteStatus.DRAFT,
    index: true,
  })
  status: RouteStatus;

  @Prop({ type: [RoutePackageSchema], default: [] })
  packages: RoutePackage[];
}

export const RouteSchema = SchemaFactory.createForClass(Route);
RouteSchema.index({ courierUserId: 1, date: 1, status: 1 });
