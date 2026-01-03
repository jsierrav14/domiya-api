import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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
  @Prop({ required: true, unique: true, index: true })
  trackingCode: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  phone: string;

  // 1 paquete = 1 dirección
  @Prop({ required: true })
  addressText: string;

  @Prop({
    type: String,
    enum: PackageStatus,
    default: PackageStatus.CREATED,
    index: true,
  })
  status: PackageStatus;

  // Ruta actual (si está asignado a una ruta activa)
  @Prop({ type: Types.ObjectId, ref: 'Route', default: null, index: true })
  routeId?: Types.ObjectId | null;

  // Si es reemplazo, enlaza al original
  @Prop({ type: Types.ObjectId, ref: 'Package', default: null })
  replacementOfPackageId?: Types.ObjectId | null;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
