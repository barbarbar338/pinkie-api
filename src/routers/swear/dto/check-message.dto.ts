import { IsDefined } from "class-validator";

export class CheckMessageDto {
    @IsDefined()
    message: string;
}
