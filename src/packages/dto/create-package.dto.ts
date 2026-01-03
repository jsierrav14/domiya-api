import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { PackageStatus } from '../schema/package.schema';

export class CreatePackageDto {
  @IsString()
  trackingCode: string;

  @IsString()
  customerName: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  addressText: string;

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus; // optional, defaults to CREATED
}
