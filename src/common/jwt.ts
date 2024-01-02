import jwt from "jsonwebtoken";

import { TOKEN_SECRET_KEY } from "../constants/env";
import { TokenPayload, TokenUserData } from "../types/token";

const EXPIRY = 1000 * 60 * 60 * 10;

export const makeToken = (userData: TokenUserData) => {
  return jwt.sign({
    iss: userData.username,
    sub: "auth",
    iat: new Date().getTime(),
    exp: new Date().getTime() + EXPIRY,
    ...userData
  } as TokenPayload, TOKEN_SECRET_KEY);
};

export const decodeToken = (token: string): TokenPayload => {
  return jwt.decode(token) as TokenPayload;
};

export const verifyToken = (token: string): boolean => {
  return !!jwt.verify(token, TOKEN_SECRET_KEY);
};
