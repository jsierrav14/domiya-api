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
import { RouteStatus } from '../schema/route.schema';
import { ApiProperty } from '@nestjs/swagger';

export class ListRoutesQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  date?: string; // YYYY-MM-DD

  @ApiProperty()
  @IsOptional()
  @IsEnum(RouteStatus)
  status?: RouteStatus;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  courierUserId?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
