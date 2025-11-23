import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/CreateConcert.dto';
import mongoose from 'mongoose';
import { UpdateConcertDto } from './dto/UpdateConcert.dto';

@Controller('concert')
export class ConcertController {
    constructor(private readonly concertService: ConcertService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    CreateConcert(@Body() createConcertDto: CreateConcertDto) {
        return this.concertService.CreateConcert(createConcertDto);
    }

    @Get('with-reserve-count')
    GetConcertsWithReserveCount() {
        return this.concertService.GetConcertsWithReserveCount();
    }


    @Get('with-reserves')
    GetConcertsWithReserves() {
        return this.concertService.GetConcertsWithReserves();
    }

    @Get()
    GetConcerts() {
        return this.concertService.GetConcerts();
    }

    @Get(':id')
    async GetConcertById(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Concert not found', 404);
        }
        const findConcert = await this.concertService.GetConcetById(id);
        if (!findConcert) {
            throw new HttpException('Concert not found', 404);
        }
        return findConcert;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async UpdateConcert(@Param('id') id: string, @Body() updateConcertDto: UpdateConcertDto) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Concert not found', 404);
        }
        return await this.concertService.UpdateConcert(id, updateConcertDto);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())
    async DeleteConcert(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Concert not found', 404);
        }
        return await this.concertService.DeleteConcert(id);
    }


}