import { IsDefined } from "class-validator";

export class ConvertDto {
    @IsDefined()
    message: string;
}
