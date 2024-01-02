import { PostgresSource } from "../../db/source";
import { Session } from "../../models/session";

export class LogoutUserService {
  public async execute(token: string): Promise<{ok: boolean, message?: string}> {
    const sessionRepository = PostgresSource.getRepository(Session);
    const session = await sessionRepository.findOneBy({token});

    if(!session) {
      return {
        message: "Сессия недействительна",
        ok: false
      };
    }

    const deleted = await sessionRepository.delete({id: session.id});

    if(!deleted.affected) {
      return {
        message: "Не удалось выполнить операцию",
        ok: false
      };
    }

    return {
      ok: true
    };
  }
}
