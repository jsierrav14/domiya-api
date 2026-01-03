import { ArrayMinSize, IsArray, IsInt, IsMongoId, Min } from 'class-validator';

export class AddStopItemDto {
  @IsMongoId()
  packageId: string;

  @IsInt()
  @Min(1)
  sequence: number;
}

export class AddStopsDto {
  @IsArray()
  @ArrayMinSize(1)
  stops: AddStopItemDto[];
}
