import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConcertSchema } from 'src/schemas/concert.schema';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { ReserveModule } from 'src/reserve/reserve.module';
import { Concert } from 'src/schemas/concert.schema';
import { ReserveTrn, ReserveTrnSchema } from 'src/schemas/reserve_trn.schema';
import { UserModule } from 'src/user/user.module';
import { forwardRef } from '@nestjs/common';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Concert.name, schema: ConcertSchema },
      { name: ReserveTrn.name, schema: ReserveTrnSchema }
    ]),
    forwardRef(() => ReserveModule),
    forwardRef(() => UserModule)
  ],
  providers: [
    ConcertService
  ],
  controllers: [
    ConcertController
  ],
  exports: [
    ConcertService,
    MongooseModule
  ]
})
export class ConcertModule {}