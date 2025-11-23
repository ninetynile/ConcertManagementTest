import { User } from './../schemas/user.schema';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDto } from './dto/CreateUser.dto';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    CreateUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    GetUsers() {
        return this.userModel.find().exec();
    }

    GetUserById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async GetUserWithReserves(id: string) {
        const mongooseId = new Types.ObjectId(id);

        return this.userModel.aggregate([
            { $match: { _id: mongooseId } },

            {
                $lookup: {
                    from: "reserves",          // collection name
                    localField: "_id",         // User _id
                    foreignField: "userId",    // Reserve.userId
                    as: "reserves",
                },
            },
        ]).exec();
    }


    async GetUserByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async GetUserByEmailWithReserves(email: string) {
        const user = await this.userModel.aggregate([
            { $match: { email: email } },
            {
                $lookup: {
                    from: "reserves",
                    localField: "_id",
                    foreignField: "userId",
                    as: "reserves",
                },
            },
        ]).exec();

        return user[0] ?? null; // ⬅ RETURN ONE OBJECT
    }
}