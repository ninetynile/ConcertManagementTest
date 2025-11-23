import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateConcertDto {
    @IsOptional()
    @IsString()
    title?: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsNumber()
    ticket?: number;
    @IsOptional()
    updateDate?: Date;
}