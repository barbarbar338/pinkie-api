import { Length, IsDefined } from "class-validator";

export class CreateAchievementDto {
    /*
        Bura `icon`un sadece tanımlanıp tanımlanmadığını kontrol ettik
        Çünkü nedense Query üzerinde katı bir doğrulama işlemi yapılamıyormuş
        Ancak bize daha katı bir kontrol lazım 
        Belirtilen `icon` bizim kalsörümüzün içinde olmayabilir
        Bunun için `canvar.controller.ts` dosyasında katı bir doğrulama sistemi yaptık

        Class Validation ve Transfor işlerinde yardımları için Ali Furkan Kurt (https://github.com/ali-furkqn)'a sonsuz teşekkürlerimi iletiyorum ❤
    */
    @IsDefined()
    icon: string;

    @Length(3, 28)
    title: string;

    @Length(3, 28)
    content: string;
}
