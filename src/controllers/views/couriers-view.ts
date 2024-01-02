import { Router } from "express";
import { addTokenData } from "../../middlewares/add-token-data";
import { GetAllCourierService } from "../../services/dispatcher/get-all-couriers-services";

export const courierRouter = Router();

courierRouter.get("/couriers", addTokenData, async (req, res) => {
  const response = await new GetAllCourierService().execute(req.tokenData?.id);

  return res.render("/couriers", {
    tokenData: req.tokenData,
    couriers: response.couriers
  });
});