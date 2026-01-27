import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PackageDocument = HydratedDocument<Package>;

export enum PackageStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  IN_ROUTE = 'IN_ROUTE',
  DELIVERED = 'DELIVERED',
  NOT_DELIVERED = 'NOT_DELIVERED',
  RETURNED = 'RETURNED',
  REPLACED = 'REPLACED',
}

@Schema({ timestamps: true })
export class Package {
  @ApiProperty()
  @Prop({ required: true, unique: true, index: true })
  trackingCode: string;

  @ApiProperty()
  @Prop({ required: true })
  customerName: string;

  @ApiProperty()
  @Prop({ required: true })
  phone: string;

  @ApiProperty()
  @Prop({ required: true })
  addressText: string;

  @ApiProperty({ enum: PackageStatus })
  @Prop({
    type: String,
    enum: PackageStatus,
    default: PackageStatus.CREATED,
    index: true,
  })
  status: PackageStatus;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Route', default: null, index: true })
  routeId?: Types.ObjectId | null;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Package', default: null })
  replacementOfPackageId?: Types.ObjectId | null;

  @ApiProperty()
  @Prop()
  createdAt?: Date;

  @ApiProperty()
  @Prop()
  updatedAt?: Date;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
