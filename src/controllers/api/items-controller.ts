import { Router } from "express";

import { PostgresSource } from "../../db/source";
import { Item } from "../../models/item";

export const itemsApiRouter = Router();

itemsApiRouter.post("/api/items/create", async (req, res) => {
  const {name, quantity} = req.body;

  const quantityNumber = parseInt(quantity);

  if(!name || !quantity || isNaN(quantityNumber)) {
    const referer = req.header("Referer") || "/";
    return res.redirect(referer);
  }

  const item = new Item(name, quantityNumber);
  const savedItem = await PostgresSource.getRepository(Item).save(item);

  console.log({savedItem});

  return res.redirect("/items");
});

itemsApiRouter.post("/api/items/delete/:itemId", async (req, res) => {
  const {itemId} = req.params;
  const id = parseInt(itemId);

  const referer = req.header("Referer") || "/";

  if(!isNaN(id)) {
    await PostgresSource.getRepository(Item).delete(id);
  }

  return res.redirect(referer);
});
