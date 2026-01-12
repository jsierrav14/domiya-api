import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PackageStatus } from '../schema/package.schema';

export class ListPackagesQueryDto {
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @IsOptional()
  @IsMongoId()
  routeId?: string;

  @IsOptional()
  @IsString()
  search?: string; // trackingCode / customerName / phone / addressText

  @IsOptional()
  @IsString()
  from?: string; // YYYY-MM-DD (createdAt >=)

  @IsOptional()
  @IsString()
  to?: string; // YYYY-MM-DD (createdAt <=)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
