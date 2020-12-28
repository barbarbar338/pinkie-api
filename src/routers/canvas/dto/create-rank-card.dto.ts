import {
    IsDefined,
    IsUrl,
    IsNumber,
    IsOptional,
    Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateRankCardDTO {
    @IsDefined()
    @Transform(i => parseInt(i))
    @IsNumber()
    xp: number;

    @IsDefined()
    @Transform(i => parseInt(i))
    @IsNumber()
    level: number;

    @IsDefined()
    @Transform(i => parseInt(i))
    @IsNumber()
    xpToLevel: number;

    @IsDefined()
    @Transform(i => parseInt(i))
    @IsNumber()
    position: number;

    @IsDefined()
    tag: string;

    @IsDefined()
    status: string;

    @IsUrl()
    avatarURL: string;

    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i)
    color?: string;
}
