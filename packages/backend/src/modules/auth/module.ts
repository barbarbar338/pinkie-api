import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models/user";
import { AuthController } from "./controller";
import { AuthService } from "./service";

@Module({
	imports: [SequelizeModule.forFeature([User])],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
