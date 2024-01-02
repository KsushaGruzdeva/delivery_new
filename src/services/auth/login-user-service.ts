import { validatePassword } from "../../common/auth";
import { decodeToken, makeToken } from "../../common/jwt";
import { PostgresSource } from "../../db/source";
import { Session } from "../../models/session";
import { User } from "../../models/user";

export class LoginUserService {
  public async execute(login: string, password: string): Promise<{token: string, message?: string}> {
    const userRepository = PostgresSource.getRepository(User);
    const user = await userRepository.findOneBy({login});

    if(!user) {
      return {
        message: "Пользователя с такими данными не существует",
        token: ""
      };
    }

    if(!validatePassword(password, user.password)) {
      return {
        message: "Пароль введён неверно",
        token: ""
      };
    }

    const token = makeToken({
      id: user.id,
      username: user.username,
      login: user.login,
      role: user.role
    });

    const session = new Session(user, token, new Date(decodeToken(token).exp));
    const savedSession = await PostgresSource.getRepository(Session).save(session);

    if(!savedSession) {
      return {
        message: "Не удалось произвести авторизацию",
        token: ""
      };
    }

    return {
      token
    };
  }
}
