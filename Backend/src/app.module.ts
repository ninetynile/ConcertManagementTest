import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConcertModule } from './concert/concert.module';
import { UserModule } from './user/user.module';
import { ReserveModule } from './reserve/reserve.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb+srv://${config.get('MONGO_USER')}:${config.get('MONGO_PASS')}@${config.get('MONGO_HOST')}/?appName=${config.get('MONGO_DB')}`,
      }),
    }),
    ConcertModule,
    ReserveModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
