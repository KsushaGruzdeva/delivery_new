import { PostgresSource } from "../../db/source";
import { Order } from "../../models/order";
import { User } from "../../models/user";

export class DeleteOrderService {
  public async execute(orderId: number, issuerId: number): Promise<{ok: boolean, message?: string}> {
    const order = await PostgresSource.getRepository(Order).findOneBy({id: orderId});

    if(!order) {
      return {
        ok: false,
        message: "Такого заказа не существует",
      };
    }

    const issuer = await PostgresSource.getRepository(User).findOneBy({id: issuerId});

    if(!issuer) {
      return {
        ok: false,
        message: "Такого пользователя не существует"
      };
    }

    const deleted = await PostgresSource.getRepository(Order).delete({id: order.id});

    if(!deleted.affected) {
      return {
        ok: false,
        message: "Не удалось удалить заказ"
      };
    }

    return {
      ok: true
    };
  }
}
