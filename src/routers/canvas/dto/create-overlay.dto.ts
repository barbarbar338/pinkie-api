import { IsDefined, IsUrl } from "class-validator";

export class CreateOverlayDto {
    /*
        buradaki @IsDefined() decorator'u da tıpkı `create-achievement.dto.ts` içerisindeki gibi bir iş görmektedir
        Katı bir doğrulama Queryde yapılamadığı için bu katı doğrulamayı `canvas.service.ts` içinde yaptık
    */
    @IsDefined()
    overlay: string;

    @IsUrl()
    imageURL: string;
}
