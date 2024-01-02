import { ORDER_STATUS_VALUES } from "../../constants/presenter";
import { PostgresSource } from "../../db/source";
import { Order, OrderStatus } from "../../models/order";
import { User, UserRole } from "../../models/user";

export class GetAllOrdersService {
  public async execute(issuerId: number | undefined): Promise<{orders: any[], ok: boolean, message?: string}> {
    const issuer = await PostgresSource.getRepository(User).findOneBy({id: issuerId || -1});

    const query = PostgresSource.getRepository(Order).createQueryBuilder("order")
      .leftJoinAndSelect("order.client", "user")
      .leftJoinAndSelect("order.cart", "item");

    if(!issuer) {
      return {
        message: "У вас нет доступа",
        orders: [],
        ok: false
      };
    }

    if(issuer.role === UserRole.CLIENT) {
      query.where("order.client.id = :id", {id: issuer.id});

    } else if(issuer.role === UserRole.COURIER) {
      query.where("order.assignedCourier IS NOT NULL AND order.assignedCourier.id = :id AND order.status = :status", {id: issuer.id, status: OrderStatus.DELIVERY_IN_PROGRESS});

    } else if(issuer.role === UserRole.STOREKEEPER) {
      query.where("order.status = :status", {status: OrderStatus.CREATED});

    } else if (issuer.role === UserRole.DISPATCHER) {
      query.where("order.status = :status OR order.status = :status_1 OR order.status = :status_2", {status: OrderStatus.PACKED, status_1: OrderStatus.DELIVERY_IN_PROGRESS, status_2: OrderStatus.DELIVERED})
    }

    const orders = await query.getMany();
    const normalizedOrders = orders.map(order => ({...order, status: ORDER_STATUS_VALUES[order.status]}))

    console.log(orders);

    return {
      orders: normalizedOrders,
      ok: true,
    };
  }
}
