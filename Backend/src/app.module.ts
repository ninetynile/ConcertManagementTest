import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConcertModule } from './concert/concert.module';
import { UserModule } from './user/user.module';
import { ReserveModule } from './reserve/reserve.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://pechdanaisp:bCgfM9C95jMXQ5Ev@cluster0.mv8urii.mongodb.net/?appName=Cluster0'),
    ConcertModule,
    ReserveModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
