import { Handler } from "express";
import { decodeToken } from "../common/jwt";

export const addTokenData: Handler = (req, _, next) => {
  const token = req.cookies.token;

  if(token) {
    const tokenData = decodeToken(token);
    req.tokenData = tokenData;
  }

  return next();
};
