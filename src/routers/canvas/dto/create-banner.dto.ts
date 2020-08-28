import { IsDefined, IsNumber, Matches } from "class-validator";

export class CreateBannerDto {
    @IsDefined()
    message: string;

    @IsNumber()
    width?: number = 750;

    @IsNumber()
    height?: number = 250;

    @Matches(/^#[0-9A-F]{6}$/i)
    bgColor?: string = "#211d1c";

    @Matches(/^#[0-9A-F]{6}$/i)
    fontColor?: string = "#ffffff";
}
