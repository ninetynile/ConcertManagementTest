import { IsNotEmpty, IsString } from "class-validator";

export class CancelReserveDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    concertId: string;
}