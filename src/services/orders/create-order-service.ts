import { PostgresSource } from "../../db/source";
import { Item } from "../../models/item";
import { Order } from "../../models/order";
import { User } from "../../models/user";

export class CreateOrderService {
  public async execute(
    location: string,
    clientId: number,
    cardItemsId: number[],
  ): Promise<{ok: boolean, id: number, message?: string}> {
    const client = await PostgresSource.getRepository(User).findOneBy({id: clientId});

    console.log({client});

    if(!client) {
      return {
        ok: false,
        id: -1,
        message: "Такого пользователя не существует"
      };
    }

    const items: Item[] = [];

    for(const itemId of cardItemsId) {
      const item = await PostgresSource.getRepository(Item).findOneBy({id: itemId});

      if(!item) {
        return {
          ok: false,
          message: `Товара с 'id = ${itemId}' не существует на складе`,
          id: -1,
        };
      }

      items.push(item);
    }

    const order = new Order(location, client);
    order.cart = items;

    console.log(order);

    const savedOrder = await PostgresSource.getRepository(Order).save(order);

    if(!savedOrder) {
      return {
        ok: false,
        message: "Не удалось создать заказ",
        id: -1,
      };
    }

    return {
      ok: true,
      id: savedOrder.id,
    };
  }
}
