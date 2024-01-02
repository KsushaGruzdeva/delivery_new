import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({nullable: false})
  public name: string;

  @Column({nullable: false})
  public quantity: number;

  @Column("timestamp", {nullable: false})
  public createdAt: Date;

  public constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
    this.createdAt = new Date();
  }
}
