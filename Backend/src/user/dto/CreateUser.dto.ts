import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    displayname: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    password: string;

    createDate: Date;
} 