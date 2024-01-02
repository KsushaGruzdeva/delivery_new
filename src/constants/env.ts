import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

export const PG_HOST = process.env["PG_HOST"] || "";
export const PG_PORT = process.env["PG_PORT"] || "";
export const PG_DATABASE = process.env["PG_DATABASE"] || "";
export const PG_USER = process.env["PG_USER"] || "";
export const PG_PASSWORD = process.env["PG_PASSWORD"] || "";
export const TOKEN_SECRET_KEY = process.env["TOKEN_SECRET_KEY"] || "";
export const POSTGRESQL_DATABASE_URL = process.env["POSTGRESQL_DATABASE_URL"] || "";
