import Sequelize from "sequelize";
import models from "@alleshq/coredb-models";

const db = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "mariadb",
		logging: false,
		dialectOptions: {
			timezone: "Etc/GMT0"
		}
	}
);
models(db);
export default db;
