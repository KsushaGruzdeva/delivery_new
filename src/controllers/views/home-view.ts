import { Router } from "express";

import { addTokenData } from "../../middlewares/add-token-data";

export const homeRouter = Router();

homeRouter.get("/", addTokenData, (req, res) => {
  return res.render("home", {
    tokenData: req.tokenData
  });
});
