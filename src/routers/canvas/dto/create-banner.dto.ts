import { IsDefined, IsNumberString, Matches, IsOptional } from "class-validator";

export class CreateBannerDto {

    @IsDefined()
    message: string;

    @IsOptional()
    @IsNumberString()
    width?: string;

    @IsOptional()
    @IsNumberString()
    height?: string;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    bgColor?: string;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    fontColor?: string;

}
