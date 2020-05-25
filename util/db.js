import credentials from "../credentials";
import Sequelize from "sequelize";
import models from "@alleshq/coredb-models";

const db = new Sequelize(
	credentials.db.name,
	credentials.db.username,
	credentials.db.password,
	{
		host: credentials.db.host,
		dialect: "mariadb",
		logging: false,
		dialectOptions: {
			timezone: "Etc/GMT0"
		}
	}
);
models(db);
export default db;
