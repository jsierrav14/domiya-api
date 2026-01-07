import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';
import { CouriersService } from './couriers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from '../routes/schema/route.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
  ],
  controllers: [CouriersController],
  providers: [CouriersService],
})
export class CouriersModule {}
