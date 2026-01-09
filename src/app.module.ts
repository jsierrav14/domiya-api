import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { UsersModule } from './users/users.module';
import { PackagesModule } from './packages/packages.module';
import { HealthModule } from './health/health.module';
import { CouriersModule } from './couriers/couriers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET') || 'SECRET_KEY';
        console.log('🚀 ~ secret:', secret);
        if (!secret) throw new Error('JWT_SECRET is missing');

        const expiresIn =
          config.get<StringValue>('JWT_EXPIRES_IN') ?? ('1d' as StringValue);

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),

    RoutesModule,
    UsersModule,
    PackagesModule,
    HealthModule,
    CouriersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
