import { Router } from "express";
import { MoreThanOrEqual } from "typeorm";

import { PostgresSource } from "../../db/source";
import { addTokenData } from "../../middlewares/add-token-data";
import { isAuthorized } from "../../middlewares/is-authorized";
import { User, UserRole } from "../../models/user";

export const employeesRouter = Router();

employeesRouter.get("/employees", addTokenData, isAuthorized, async (req, res) => {
  const employees = await PostgresSource.getRepository(User).find({
    where: {role: MoreThanOrEqual(UserRole.COURIER)},
    order: {role: "ASC"}
  });

  return res.render("employees/all-employees", {
    employees: employees || [],
    tokenData: req.tokenData
  });
});

employeesRouter.get("/employees/create", addTokenData, isAuthorized, async (req, res) => {
  return res.render("employees/create-employee", {
    tokenData: req.tokenData,
    message: null
  });
});
