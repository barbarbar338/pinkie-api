import { Length, IsDefined, ValidateIf } from "class-validator";
import { ICONS } from "src/assets/mcIcons";

export class CreateAchievementDto {

    /*
        Üzerinde çalışılıyor
        Sadece belirtilmiş olması yeterli değil.
        Ayrıca `ICONS` içinde de var olması lazım.

        @ValidateIf(i => Object.values(ICONS).includes(i.icon))
        Yukarıda belirttiğimiz doğrulama işlemi nedense çalışmıyor.   
    */
    @IsDefined()
    icon: string;

    @Length(3, 28)
    title: string;

    @Length(3, 28)
    content: string;

}
