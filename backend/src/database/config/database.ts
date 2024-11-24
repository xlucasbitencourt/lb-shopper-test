import "dotenv/config";
import { Options } from "sequelize";

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

const config: Options = {
  username: DB_USER || 'root',
  password: DB_PASSWORD || 'root',
  database: DB_NAME || 'rides_db',
  host: DB_HOST || 'localhost',
  dialect: "mysql",
};

export = config;