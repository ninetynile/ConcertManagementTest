import { CreateConcertDto } from './dto/CreateConcert.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Concert } from "../schemas/concert.schema";
import { Reserve } from "../schemas/reserve.schema";
import { ReserveTrn } from '../schemas/reserve_trn.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class ConcertService {
    constructor(
        @InjectModel(Concert.name) private readonly concertModel: Model<Concert>,
        @InjectModel(Reserve.name) private readonly reserveModel: Model<Reserve>,
        @InjectModel(ReserveTrn.name) private readonly reserveTrnModel: Model<ReserveTrn>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    CreateConcert(createConcertDto: CreateConcertDto): Promise<Concert> {
        const newConcert = new this.concertModel(createConcertDto);
        return newConcert.save();
    }

    GetConcerts() {
        return this.concertModel.find().exec();
    }

    GetConcetById(id: string) {
        return this.concertModel.findById(id).exec();
    }

    async UpdateConcert(id: string, updateConcertDto: Partial<Concert>) {
        //update concert title in reserveTrn collection to new concert title (match id) 
        if (updateConcertDto.title) {
            await this.reserveTrnModel.updateMany(
                { concertId: id },
                { $set: { concertTitle: updateConcertDto.title } }
            ).exec();
        }
        
        return this.concertModel.findByIdAndUpdate(id, updateConcertDto, { new: true }).exec();
    }

    async GetConcertsWithReserves() {
        const concerts = await this.concertModel.aggregate([
        {
            $lookup: {
                from: 'reserves',
                localField: '_id',
                foreignField: 'concertId',
                as: 'reserveData',
            },
        }]);

        return concerts;
    }

    async DeleteConcert(id: string) {
        const concert = await this.concertModel.findById(id).exec();
        if (!concert) {
            throw new Error('Concert not found');
        }

        // Find all reserves related to this concert
        const reserves = await this.reserveModel.find({ concertId: id }).exec();

        // Fetch users for these reserves
        const userIds = reserves.map(r => r.userId);
        const users = await this.userModel.find({ _id: { $in: userIds } }).exec();
        const userMap = new Map(users.map(u => [u._id.toString(), u.displayname]));

        // Create reserve_trn records in bulk
        if (reserves.length > 0) {
            const trnRecords = reserves.map(r => ({
                userId: r.userId,
                userName: userMap.get(r.userId.toString()) || 'Unknown', // lookup displayName
                concertId: r.concertId,
                concertTitle: concert.title,
                action: 'concert_deleted',
                createDate: new Date(),
            }));
            await this.reserveTrnModel.insertMany(trnRecords);
        }

        // Delete all reserves that match concertId
        await this.reserveModel.deleteMany({ concertId: id });

        // Delete the concert itself
        return this.concertModel.findByIdAndDelete(id).exec();
    }

    async GetConcertsWithReserveCount() {
        return this.concertModel.aggregate([
            {
                $lookup: {
                    from: 'reserves',
                    localField: '_id',
                    foreignField: 'concertId',
                    as: 'reserveData',
                },
            },
            {
                $addFields: {
                    reserveCount: { $size: '$reserveData' },
                },
            },
            {
                $project: {
                    reserveData: 0,
                },
            },
        ]);
    }
}
