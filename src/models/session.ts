import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.id, {eager: true})
  public issuer!: User;

  @Column({nullable: false})
  public token: string;

  @Column("timestamp", {nullable: false})
  public createdAt: Date;

  @Column("timestamp", {nullable: false})
  public expiresAt: Date;

  public constructor(issuer: User, token: string, expiresAt: Date) {
    this.issuer = issuer;
    this.token = token;
    this.createdAt = new Date();
    this.expiresAt = expiresAt;
  }
}
