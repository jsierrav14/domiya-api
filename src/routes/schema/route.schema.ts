import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RouteDocument = HydratedDocument<Route>;

export enum RouteStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

@Schema({ _id: false })
export class RoutePackage {
  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Package', required: true })
  packageId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  sequence: number;
}
export const RoutePackageSchema = SchemaFactory.createForClass(RoutePackage);

@Schema({ timestamps: true })
export class Route {
  @ApiProperty()
  @Prop({ required: true })
  date: string;

  @ApiProperty()
  @Prop({ required: true })
  shift: string;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  courierUserId: Types.ObjectId;

  @ApiProperty({ enum: RouteStatus })
  @Prop({
    type: String,
    enum: RouteStatus,
    default: RouteStatus.DRAFT,
    index: true,
  })
  status: RouteStatus;

  @ApiProperty({ type: [RoutePackage] })
  @Prop({ type: [RoutePackageSchema], default: [] })
  packages: RoutePackage[];

  @ApiProperty()
  @Prop()
  createdAt?: Date;

  @ApiProperty()
  @Prop()
  updatedAt?: Date;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
RouteSchema.index({ courierUserId: 1, date: 1, status: 1 });
