import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/CreateUser.dto";
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post()
    @UsePipes(new ValidationPipe())
    CreateUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.CreateUser(createUserDto);
    }

    @Get()
    GetUsers() {
        return this.userService.GetUsers();
    }

    @Get(':email')
    async GetUserByEmail(@Param('email') email: string) {
        const findUser = await this.userService.GetUserByEmail(email);
        if (!findUser) {
            throw new HttpException('User not found', 404);
        }
        return findUser;
    }

    @Get('/reserves/:email')
    async GetUserByEmailWithReserves(@Param('email') email: string) {
        const findUser = await this.userService.GetUserByEmailWithReserves(email);
        if (!findUser) {
            throw new HttpException('User not found', 404);
        }
        return findUser;
    }


    @Get(':id')
    GetUserById(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('User not found', 404);
        }
        const findUser = this.userService.GetUserById(id);
        if (!findUser) {
            throw new HttpException('User not found', 404);
        }
        return findUser;
    }
    

}