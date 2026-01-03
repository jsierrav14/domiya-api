import { IsMongoId, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  date: string; // YYYY-MM-DD

  @IsString()
  shift: string;

  @IsMongoId()
  courierUserId: string;
}
