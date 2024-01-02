import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Item } from "./item";
import { User } from "./user";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({nullable: false})
  public location: string;

  @ManyToOne(() => User, (user) => user.id, {eager: true})
  public client: User;

  @ManyToOne(() => User, (user) => user.id, {eager: true, nullable: true})
  public assignedCourier: User | null;

  @ManyToMany(() => Item, {eager: true})
  @JoinTable()
  public cart!: Item[];

  @Column({nullable: false})
  public status: OrderStatus;

  @Column({nullable: false, default: false})
  public cartFilled: boolean;

  @Column("timestamp", {nullable: false})
  public createdAt: Date;

  @Column("timestamp", {nullable: true})
  public deliveredAt: Date | null;

  public constructor(location: string, client: User, status?: OrderStatus) {
    this.client = client;
    this.assignedCourier = null;
    this.location = location;
    this.status = status || OrderStatus.CREATED;
    this.cartFilled = false;
    this.createdAt = new Date();
    this.deliveredAt = null;
  }
}

export enum OrderStatus {
  CREATED,
  PACKED,
  DELIVERY_IN_PROGRESS,
  DELIVERED
}
