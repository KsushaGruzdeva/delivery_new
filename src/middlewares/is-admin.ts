import { Handler } from "express";
import { UserRole } from "../models/user";

export const isAdmin: Handler = (req, res, next) => {
  const userRole = req.tokenData!.role;

  if(userRole !== UserRole.ADMIN) {
    return res.render("errors/forbidden");
  }

  return next();
};
