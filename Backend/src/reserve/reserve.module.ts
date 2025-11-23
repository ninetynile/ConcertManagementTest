import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reserve, ReserveSchema } from '../schemas/reserve.schema';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { ReserveTrn, ReserveTrnSchema } from '../schemas/reserve_trn.schema';
import { UserModule } from '../user/user.module';
import { forwardRef } from '@nestjs/common';
import { ConcertModule } from '../concert/concert.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reserve.name, schema: ReserveSchema }, 
      { name: ReserveTrn.name, schema: ReserveTrnSchema },
    ]),
    forwardRef(() => UserModule), 
    forwardRef(() => ConcertModule), 
  ],
  providers: [
    ReserveService
  ],
  controllers: [
    ReserveController
  ],
  exports: [
    MongooseModule
  ]
})
export class ReserveModule {}