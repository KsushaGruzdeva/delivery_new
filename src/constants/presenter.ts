import { OrderStatus } from "../models/order";

export const ORDER_STATUS_VALUES = {
  [OrderStatus.CREATED]: {
    value: "CREATED",
    label: "Создан" 
  },
  [OrderStatus.PACKED]: {
    value: "PACKED",
    label: "Собран" 
  },
  [OrderStatus.DELIVERY_IN_PROGRESS]: {
    value: "DELIVERY_IN_PROGRESS",
    label: "В процессе доставки" 
  },
  [OrderStatus.DELIVERED]: {
    value: "DELIVERED",
    label: "Доставлен" 
  },
};
