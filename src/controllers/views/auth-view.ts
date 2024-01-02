import { Router } from "express";

import { addTokenData } from "../../middlewares/add-token-data";

export const authRouter = Router();

authRouter.get("/auth/login", addTokenData, async (req, res) => {
  return res.render("auth/login", {
    tokenData: req.tokenData,
    message: null
  });
});

authRouter.get("/auth/signup", addTokenData, async (req, res) => {
  return res.render("auth/signup", {
    tokenData: req.tokenData,
    message: null
  });
});

authRouter.get("/auth/logout", addTokenData, async (req, res) => {
  return res.render("auth/logout", {
    tokenData: req.tokenData
  });
});
