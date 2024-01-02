import { Router } from "express";

import { AUTH_COOKIE_NAME } from "../../constants/auth";
import { addTokenData } from "../../middlewares/add-token-data";
import { isAuthorized } from "../../middlewares/is-authorized";
import { UserRole } from "../../models/user";
import { LoginUserService } from "../../services/auth/login-user-service";
import { LogoutUserService } from "../../services/auth/logout-user-service";
import { CreateUserService } from "../../services/users/create-user-service";

export const authApiRouter = Router();

authApiRouter.post("/api/auth/login", addTokenData, async (req, res) => {
  const {login, password} = req.body;

  if(!login || !password) {
    return res.render("auth/login", {
      message: {
        text: "Необходимо заполнить все поля",
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData
    });
  }

  const response = await new LoginUserService().execute(login, password);

  if(response.message) {
    return res.render("auth/login", {
      message: {
        text: response.message,
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData
    });
  }

  res.cookie(AUTH_COOKIE_NAME, response.token);
  return res.redirect("/");
});

authApiRouter.post("/api/auth/signup", addTokenData, async (req, res) => {
  const {username, login, email, password, passwordConfirm} = req.body;

  if(!username || !login || !email || !password || !passwordConfirm) {
    return res.render("auth/signup", {
      message: {
        text: "Необходимо заполнить все поля",
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData
    });
  }

  const response = await new CreateUserService().execute(username, login, email, password, passwordConfirm, UserRole.CLIENT);

  if(response.message) {
    return res.render("auth/signup", {
      message: {
        text: response.message,
        alertClass: "alert-danger"
      },
      tokenData: req.tokenData
    });
  }

  return res.redirect("/auth/login");
});

authApiRouter.post("/api/auth/logout", addTokenData, isAuthorized, async (req, res) => {
  const response = await new LogoutUserService().execute(req.cookies[AUTH_COOKIE_NAME]);

  if(response.message) {
    console.log(response);
  }

  res.cookie(AUTH_COOKIE_NAME, "");
  return res.redirect("/");
});
