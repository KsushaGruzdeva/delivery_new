import { PostgresSource } from "../../db/source";
import { User, UserRole } from "../../models/user";

export class CreateUserService {
  public async execute(
    username: string,
    login: string,
    email: string,
    password: string,
    passwordConfirm: string,
    role: UserRole = UserRole.CLIENT
  ): Promise<{id: number, message?: string}> {
    if(password.trim() !== passwordConfirm.trim()) {
      return ({
        message: "Пароли должны совпадать",
        id: -1
      });
    }

    const userRepository = PostgresSource.getRepository(User);
    const existingUsers = await userRepository.findBy([{login}, {email}]);

    if(existingUsers.length !== 0) {
      return {
        message: "Пользователь с такими данными уже существует",
        id: -1,
      };
    }

    const user = new User(username, login, email, password, role);
    const savedUser = await userRepository.save(user);

    return {id: savedUser.id};
  }
}
