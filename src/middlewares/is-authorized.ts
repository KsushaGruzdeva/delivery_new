import { Handler } from "express";

import { decodeToken, verifyToken } from "../common/jwt";
import { AUTH_COOKIE_NAME } from "../constants/auth";

export const isAuthorized: Handler = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    return res.redirect("/auth/login");
  }

  if(!verifyToken(token)) {
    res.cookie(AUTH_COOKIE_NAME, "");
    return res.redirect("/auth/login");
  }

  const tokenData = decodeToken(token);

  if(tokenData.exp < Date.now()) {
    res.cookie(AUTH_COOKIE_NAME, "");
    return res.redirect("/auth/login");
  }

  req.tokenData = tokenData;
  return next();
};
