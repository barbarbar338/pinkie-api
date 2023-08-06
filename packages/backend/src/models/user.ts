import { Column, Model, Table } from "sequelize-typescript";
import { CONFIG } from "src/config";

@Table
export class User extends Model {
	@Column({
		allowNull: false,
		unique: true,
		primaryKey: true,
		defaultValue: () => CONFIG.pika.gen("user"),
	})
	declare user_id: string;

	@Column({
		allowNull: false,
		unique: true,
	})
	declare email: string;

	@Column({
		allowNull: false,
	})
	declare password: string;

	@Column({
		allowNull: false,
		unique: true,
		defaultValue: () => CONFIG.pika.gen("access_token"),
	})
	declare access_token: string;

	@Column({
		allowNull: false,
		defaultValue: PinkieAPI.UserType.FREE,
	})
	declare type: PinkieAPI.UserType;
}
