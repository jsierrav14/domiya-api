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
export class RouteStop {
  @Prop({ type: Types.ObjectId, ref: 'Package', required: true })
  packageId: Types.ObjectId;

  @Prop({ required: true })
  sequence: number;

  @Prop({ default: 'PENDING' })
  stopStatus: 'PENDING' | 'DONE' | 'SKIPPED';
}
export const RouteStopSchema = SchemaFactory.createForClass(RouteStop);

@Schema({ timestamps: true })
export class Route {
  @Prop({ required: true })
  date: string; // YYYY-MM-DD

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

  @Prop({ type: [RouteStopSchema], default: [] })
  stops: RouteStop[];
}
export const RouteSchema = SchemaFactory.createForClass(Route);
RouteSchema.index({ date: 1, courierUserId: 1, shift: 1 }, { unique: false });
