import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({nullable: false})
  public username: string;

  @Column({nullable: false})
  public login: string;

  @Column({nullable: false})
  public email: string;

  @Column({nullable: false})
  public password: string;

  @Column({nullable: false})
  public role: UserRole;

  @Column("timestamp", {nullable: false})
  public createdAt: Date;

  public constructor(username: string, login: string, email: string, password: string, role?: UserRole) {
    this.username = username;
    this.login = login;
    this.email = email;
    this.password = password;
    this.role = role || UserRole.CLIENT;
    this.createdAt = new Date();
  }
}

export enum UserRole {
  CLIENT,
  COURIER,
  STOREKEEPER,
  DISPATCHER,
  ADMIN
}
