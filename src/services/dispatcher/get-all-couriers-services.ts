import { PostgresSource } from "../../db/source";
import { User, UserRole } from "../../models/user";

export class GetAllCourierService{
  public async execute(issuerId: number | undefined): Promise<{couriers: User[], message?: string}> {
    const issuer = await PostgresSource.getRepository(User).findOneBy({id: issuerId || -1});

      if(!issuer || (issuer.role !== UserRole.DISPATCHER && issuer.role !== UserRole.ADMIN)) {
      return {
          message: "У вас нет доступа",
          couriers: [],
        };
      }
      const courier = (await PostgresSource.getRepository(User).findBy({role: UserRole.COURIER}));

      console.log(courier);

      return{
        couriers: courier,
      }
  }
}