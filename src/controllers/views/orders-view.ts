import { Router } from "express";

import { PostgresSource } from "../../db/source";
import { addTokenData } from "../../middlewares/add-token-data";
import { Item } from "../../models/item";
import { GetAllOrdersService } from "../../services/orders/get-all-orders-service";
import { Order } from "../../models/order";
import { GetAllCourierService } from "../../services/dispatcher/get-all-couriers-services";

export const orderRouter = Router();

orderRouter.get("/orders", addTokenData, async (req, res) => {
  const response = await new GetAllOrdersService().execute(req.tokenData?.id);

  return res.render("orders/all-orders", {
    tokenData: req.tokenData,
    orders: response.orders
  });
});

orderRouter.get("/out/create_order", addTokenData, async (req, res) => {
  const items = await PostgresSource.getRepository(Item).find();

  return res.render("out/create-order", {
    tokenData: req.tokenData,
    message: null,
    items
  });
});

orderRouter.get("/orders_storekeeper/:id", addTokenData, async (req, res) => {
  const {id} = req.params;
  const id_order = parseInt(id!);

  if(!id || isNaN(id_order)) {
    return res.redirect("/orders");
  }

  const order = await PostgresSource.getRepository(Order).findOne({
    where: {
      id : id_order,
    }
  });

  return res.render("orders/order-storekeeper", {
    tokenData: req.tokenData,
    message: null,
    order
  });
});

orderRouter.get("/orders_courier/:id", addTokenData, async (req, res) => {
  const {id} = req.params;
  const id_order = parseInt(id!);

  if(!id || isNaN(id_order)) {
    return res.redirect("/orders");
  }

  const order = await PostgresSource.getRepository(Order).findOne({
    where: {
      id : id_order,
    }
  });

  return res.render("orders/order-courier", {
    tokenData: req.tokenData,
    message: null,
    order
  });
});

orderRouter.get("/orders_dispatcher/:id", addTokenData, async (req, res) => {
  const {id} = req.params;
  const id_order = parseInt(id!);

  if(!id || isNaN(id_order)) {
    return res.redirect("/orders");
  }

  const order = await PostgresSource.getRepository(Order).findOne({
    where: {
      id : id_order,
    }
  });

  const couriers = await new GetAllCourierService().execute(req.tokenData?.id);

  return res.render("dispatcher/order-dispatcher", {
    tokenData: req.tokenData,
    couriers: couriers.couriers,
    message: null,
    order
  });
});