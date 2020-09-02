import { IsDefined, IsNumber, Matches, IsOptional, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

export class CreateBannerDto {
    @IsDefined()
    message: string;

    @IsOptional()
    @Transform(i => parseInt(i))
    @IsNumber()
    @Min(100)
    @Max(2500)
    width?: number;

    @IsOptional()
    @Transform(i => parseInt(i))
    @IsNumber()
    @Min(100)
    @Max(2500)
    height?: number;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    bgColor?: string;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    fontColor?: string;
}
