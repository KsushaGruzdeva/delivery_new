import { User } from "../models/user";

export type TokenUserData = Pick<User, "id" | "username" | "login" | "role">;

export type TokenPayload = {
  iss: string,
  sub: string,
  iat: number,
  exp: number
} & TokenUserData;
