import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty({ enum: UserRole })
  @Prop({
    type: String,
    enum: UserRole,
    required: true,
    index: true,
  })
  role: UserRole;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop()
  phone?: string;

  @ApiProperty()
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

  @ApiProperty()
  @Prop({ default: false })
  deleted: boolean;

  @ApiProperty()
  @Prop()
  createdAt?: Date;

  @ApiProperty()
  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
