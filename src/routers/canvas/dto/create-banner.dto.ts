import { IsDefined, IsNumber, Matches, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateBannerDto {
    @IsDefined()
    message: string;

    @IsOptional()
    @Transform(i => parseInt(i))
    @IsNumber()
    width?: number;

    @IsOptional()
    @Transform(i => parseInt(i))
    @IsNumber()
    height?: number;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    bgColor?: string;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    fontColor?: string;
}
