import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../types/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  })
  email: string;

  @Prop({ required: true })
  password: string; // hashed

  @Prop({
    type: String,
    enum: UserRole,
    required: true,
    index: true,
  })
  role: UserRole;

  // Only for couriers
  @Prop({ default: true })
  isActive: boolean;

  // Optional operational data
  @Prop()
  phone?: string;

  // Last known position (for couriers – optional)
  @Prop({
    type: {
      lat: Number,
      lng: Number,
    },
    default: null,
  })
  lastLocation?: {
    lat: number;
    lng: number;
  };

  // Soft delete (recommended)
  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
