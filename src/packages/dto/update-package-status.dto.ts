import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PackageStatus } from '../schema/package.schema';

export class UpdatePackageStatusDto {
  @IsEnum(PackageStatus)
  status: PackageStatus;

  @IsOptional()
  @IsString()
  reasonCode?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
