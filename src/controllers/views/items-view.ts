import { Router } from "express";

import { addTokenData } from "../../middlewares/add-token-data";
import { GetAllItemsService } from "../../services/items/get-all-items";

export const itemRouter = Router();

itemRouter.get("/items", addTokenData, async (req, res) => {
  const items = await new GetAllItemsService().execute();

  return res.render("items/all-items", {
    items: items || [],
    tokenData: req.tokenData
  });
});

itemRouter.get("/items/create", addTokenData, (req, res) => {
  return res.render("items/create-item", {
    message: null,
    tokenData: req.tokenData
  });
});
