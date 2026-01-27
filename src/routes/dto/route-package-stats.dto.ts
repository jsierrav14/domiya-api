import { ApiProperty } from '@nestjs/swagger';

export class RoutePackageStats {
  @ApiProperty({ type: String })
  routeId: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  shift: string;

  @ApiProperty()
  totalPackages: number;

  @ApiProperty()
  delivered: number;

  @ApiProperty()
  returned: number;

  @ApiProperty()
  notDelivered: number;

  @ApiProperty()
  replaced: number;

  @ApiProperty()
  inRoute: number;

  @ApiProperty()
  deliveryRate: number; // percentage
}
