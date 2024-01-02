import { Router } from "express";

import { PostgresSource } from "../../db/source";
import { addTokenData } from "../../middlewares/add-token-data";
import { Item } from "../../models/item";
import { CreateOrderService } from "../../services/orders/create-order-service";
import { DeleteOrderService } from "../../services/orders/delete-order-service";
import { Order, OrderStatus } from "../../models/order";
import { GetAllCourierService } from "../../services/dispatcher/get-all-couriers-services";
import { User } from "../../models/user"

export const ordersApiRouter = Router();

ordersApiRouter.post("/api/orders/create", addTokenData, async (req, res) => {
  const {location, clientId, cartItemsId} = req.body;

  const cartIds = typeof cartItemsId === "string"
    ? [cartItemsId]
    : cartItemsId;

  const items = await PostgresSource.getRepository(Item).find();

  if(!location || isNaN(clientId) || !cartItemsId || cartIds.length === 0) {
    return res.render("out/create-order", {
      tokenData: req.tokenData,
      message: "Необходимо заполнить все поля",
      items
    });
  }

  const response = await new CreateOrderService().execute(location, clientId, cartIds);

  if(!response.ok) {

    return res.render("out/create-order", {
      tokenData: req.tokenData,
      message: response.message || null,
      items
    });
  }

  return res.redirect("/orders");
});

ordersApiRouter.post("/api/orders/delete/:orderId", addTokenData, async (req, res) => {
  const {orderId} = req.params;
  const id = parseInt(orderId!);

  if(!orderId || isNaN(id)) {
    return res.redirect("/orders");
  }

  await new DeleteOrderService().execute(id, req.tokenData!.id);
  return res.redirect("/orders");
});

ordersApiRouter.post("/api/orders/fill_cart/:id", addTokenData, async (req, res) =>{
  const {id} = req.params;
  const orderId = parseInt(id!);

  if(!id || isNaN(orderId)) {
    return res.redirect("/orders");
  }
  const orderRepository = PostgresSource.getRepository(Order);
  const order = await orderRepository.findOneBy({id: orderId});

  if (order === null){
    return res.redirect("/orders");
  }

  order.status = OrderStatus.PACKED;
  order.cartFilled = true;

  await orderRepository.save(order);

  const referer = req.header("Referer") || "/";

  return res.redirect(referer);
});

ordersApiRouter.post("/api/orders/courier/:id", addTokenData, async (req, res) =>{
  const {id} = req.params;
  const orderId = parseInt(id!);

  if(!id || isNaN(orderId)) {
    return res.redirect("/orders");
  }
  const orderRepository = PostgresSource.getRepository(Order);
  const order = await orderRepository.findOneBy({id: orderId});

  if (order === null){
    return res.redirect("/orders");
  }

  order.status = OrderStatus.DELIVERED;
  order.deliveredAt = new Date();

  await orderRepository.save(order);

  const referer = req.header("Referer") || "/";

  return res.redirect(referer);
});

ordersApiRouter.post("/api/orders/dispatcher/:id", addTokenData, async (req, res) =>{
  const {id} = req.params;
  const {assignedCourierId} = req.body;

  const orderId = parseInt(id!);
  const courierId = parseInt(assignedCourierId!);

  if(!id || isNaN(orderId)) {
    return res.redirect("/orders");
  }

  const orderRepository = PostgresSource.getRepository(Order);
  const order = await orderRepository.findOneBy({id: orderId});

  if (order === null){
    return res.redirect("/orders");
  }

  const couriers = await new GetAllCourierService().execute(req.tokenData!.id);

  if(couriers.couriers.length === 0 || isNaN(courierId) || !assignedCourierId) {
    return res.render("dispatcher/order-dispatcher", {
      message: {
        text: "Необходимо заполнить все поля",
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData,
      order,
      couriers: couriers.couriers,
    });
  }

  const userRepository = PostgresSource.getRepository(User);
  const courier = await userRepository.findOneBy({id: courierId});

  if (courier === null){
    return res.redirect("/orders");
  }

  order.status = OrderStatus.DELIVERY_IN_PROGRESS;

  order.assignedCourier = courier;

  await orderRepository.save(order);

  // const referer = req.header("Referer") || "/";

  return res.redirect("/orders");
});