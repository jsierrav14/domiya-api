import { ArrayMinSize, IsArray, IsInt, IsMongoId, Min } from 'class-validator';

export class AddPackageItemDto {
  @IsMongoId()
  packageId: string;

  @IsInt()
  @Min(1)
  sequence: number;
}

export class AddPackagesDto {
  @IsArray()
  @ArrayMinSize(1)
  packages: AddPackageItemDto[];
}
