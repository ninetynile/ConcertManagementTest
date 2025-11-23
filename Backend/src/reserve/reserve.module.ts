import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reserve, ReserveSchema } from 'src/schemas/reserve.schema';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { ReserveTrn, ReserveTrnSchema } from 'src/schemas/reserve_trn.schema';
import { UserModule } from 'src/user/user.module';
import { forwardRef } from '@nestjs/common';
import { ConcertModule } from 'src/concert/concert.module';

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