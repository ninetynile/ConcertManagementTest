import { CancelReserveDto } from './dto/CancelReserve.dto';
import { CreateReserveDto } from './dto/CreateReserve.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Reserve } from "src/schemas/reserve.schema";
import { ReserveTrn } from 'src/schemas/reserve_trn.schema';
import { Concert } from 'src/schemas/concert.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ReserveService {   
    constructor(
        @InjectModel(Reserve.name) private reserveModel: Model<Reserve>,
        @InjectModel(ReserveTrn.name) private reserveTrnModel: Model<ReserveTrn>,
        @InjectModel(Concert.name) private concertModel: Model<Concert>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    getReserveByUserId(id: string) {
        return this.reserveModel.find({ userId: id }).exec();
    }

    async createReserve(createReserveDto: CreateReserveDto) {
        const concert = await this.concertModel.findById(createReserveDto.concertId).exec();

        if (!concert) {
            throw new Error('Concert not found');
        }

        const user = await this.userModel.findById(createReserveDto.userId).exec();

        if (!user) {
            throw new Error('User not found');
        }

        const newReserve = new this.reserveModel(createReserveDto);
        const saved = await newReserve.save();

        const trn = new this.reserveTrnModel({
            userId: createReserveDto.userId,
            userName: user.displayname,
            concertId: createReserveDto.concertId,
            concertTitle: concert.title,  
            action: 'reserved',
        });

        await trn.save();

        return saved;
    }

    async cancelReserve(cancelReserveDto: CancelReserveDto) {
        const concert = await this.concertModel.findById(cancelReserveDto.concertId).exec();

        if (!concert) {
            throw new Error('Concert not found');
        }

        const user = await this.userModel.findById(cancelReserveDto.userId).exec();

        if (!user) {
            throw new Error('User not found');
        }

        const trn = new this.reserveTrnModel({
            userId: cancelReserveDto.userId,
            userName: user.displayname,
            concertId: cancelReserveDto.concertId,
            concertTitle: concert.title,  
            action: 'cancelled',
        });

        await trn.save();

        return this.reserveModel.findOneAndDelete(cancelReserveDto);
    }

    getReserveTrn() {
        return this.reserveTrnModel.find().exec();
    }

    getReserveTrnByUserId(id: string) {
        return this.reserveTrnModel.find({ userId: id }).exec();
    }

}