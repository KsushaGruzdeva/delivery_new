import { PostgresSource } from "./source";

export const connect = async () => {
  await PostgresSource.initialize().then(() => console.log("Postgres Data Source has been initialized!"));
};
