import { UserService } from './../user/user.service';
import { Body, Controller, Delete, Get, Post, UsePipes, ValidationPipe, Param} from "@nestjs/common";
import { ReserveService } from "./reserve.service";
import { CreateReserveDto } from "./dto/CreateReserve.dto";
import { ConcertService } from "src/concert/concert.service";
import { HttpException } from "@nestjs/common";
import { CancelReserveDto } from "./dto/CancelReserve.dto";
import mongoose from 'mongoose';

@Controller('reserve')
export class ReserveController {
    constructor(
        private readonly reserveService: ReserveService,
        private readonly concertService: ConcertService,
        private readonly userService: UserService
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async createReserve(@Body() createReserveDto: CreateReserveDto) {
        const findConcert = await this.concertService.GetConcetById(createReserveDto.concertId);
        if (!findConcert) {
            throw new HttpException('Concert not found', 404);
        }
        return this.reserveService.createReserve(createReserveDto);
    }

    @Delete()
    @UsePipes(new ValidationPipe())
    async cancelReserve(@Body() cancelReserveDto: CancelReserveDto) {
        const findConcert = await this.concertService.GetConcetById(cancelReserveDto.concertId);
        if (!findConcert) {
            throw new HttpException('Concert not found', 404);
        }
        return this.reserveService.cancelReserve(cancelReserveDto);
    }

    @Get('trn')
    getReserveTrn() {
        return this.reserveService.getReserveTrn();
    }

    @Get('trn/user/:id')
    async getReserveTrnByUserId(@Param('id') id: string) {
        const isVaild = mongoose.Types.ObjectId.isValid(id);
        if (!isVaild) {
            throw new HttpException('User not found', 404);
        }
        const findUser = await this.userService.GetUserById(id);
        if (!findUser) {
            throw new HttpException('User not found', 404);
        }
        return this.reserveService.getReserveTrnByUserId(id);
    }

    @Get(':id')
    async getReserveByUserId(@Param('id') id: string) {
        const isVaild = mongoose.Types.ObjectId.isValid(id);
        if (!isVaild) {
            throw new HttpException('User not found', 404);
        }
        const findUser = await this.userService.GetUserById(id);
        if (!findUser) {
            throw new HttpException('User not found', 404);
        }
        return this.reserveService.getReserveByUserId(id);
    }

}