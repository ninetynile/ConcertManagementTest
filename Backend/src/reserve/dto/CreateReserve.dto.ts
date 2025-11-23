import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReserveDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    concertId: string;

    @IsOptional()
    createDate: Date;
}