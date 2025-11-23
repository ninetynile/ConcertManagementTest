import { Body, Controller, Get, HttpException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/CreateUser.dto";
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async CreateUser(@Body() createUserDto: CreateUserDto) {
        return await this.userService.CreateUser(createUserDto);
    }

    @Get()
    async GetUsers() {
        return await this.userService.GetUsers();
    }

    @Get('email/:email')
    async GetUserByEmail(@Param('email') email: string) {
        const user = await this.userService.GetUserByEmail(email);
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return user;
    }

    @Get('reserves/:email')
    async GetUserByEmailWithReserves(@Param('email') email: string) {
        const user = await this.userService.GetUserByEmailWithReserves(email);
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return user;
    }

    @Get(':id')
    async GetUserById(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('User not found', 404);
        }
        const user = await this.userService.GetUserById(id);
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return user;
    }
}
