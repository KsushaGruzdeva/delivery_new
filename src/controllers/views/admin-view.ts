import { Router } from "express";

import { addTokenData } from "../../middlewares/add-token-data";
import { isAuthorized } from "../../middlewares/is-authorized";
import { UserRole } from "../../models/user";

export const adminRouter = Router();

adminRouter.get("/admin/users", addTokenData, isAuthorized, (req, res) => {
  if(req.tokenData!.role <= UserRole.COURIER) {
    return res.render("errors/forbidden", {
      tokenData: req.tokenData
    });
  }

  return res.render("admin/users", {
    users: [
      {id: 1, name: "Vlad", email: "example@gmail.com", role: "ADMIN"},
      {id: 2, name: "Nikita", email: "some-email@gmail.com", role: "USER"}
    ],
    tokenData: req.tokenData
  });
});
