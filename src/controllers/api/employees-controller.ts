import { Router } from "express";

import { PostgresSource } from "../../db/source";
import { addTokenData } from "../../middlewares/add-token-data";
import { isAuthorized } from "../../middlewares/is-authorized";
import { Session } from "../../models/session";
import { User } from "../../models/user";
import { CreateUserService } from "../../services/users/create-user-service";

export const employeesApiRouter = Router();

employeesApiRouter.post("/api/employees", addTokenData, isAuthorized, async (req, res) => {
  const {username, login, email, password, passwordConfirm, role} = req.body;

  if(!username || !login || !email || !password || !passwordConfirm || role == undefined) {
    return res.render("employees/create-employee", {
      message: {
        text: "Необходимо заполнить все поля",
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData
    });
  }

  const response = await new CreateUserService().execute(username, login, email, password, passwordConfirm, role);

  if(response.message) {
    return res.render("employees/create-employee", {
      message: {
        text: response.message,
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData
    });
  }

  return res.redirect("/employees");
});


employeesApiRouter.post("/api/employees/delete/:employeeId", addTokenData, isAuthorized, async (req, res) => {
  const {employeeId} = req.params;

  const id = parseInt(employeeId!);
  const referer = req.header("Referer") || "/";

  if(!employeeId || isNaN(id)) {
    return res.redirect(referer);
  }

  const sessionRepository = PostgresSource.getRepository(Session);
  const sessions = await sessionRepository.findBy({issuer: {id}});

  for(const session of sessions) {
    await sessionRepository.delete({id: session.id});
  }

  await PostgresSource.getRepository(User).delete({id});
  return res.redirect(referer);
});
