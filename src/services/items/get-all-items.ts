import { PostgresSource } from "../../db/source";
import { Item } from "../../models/item";

export class GetAllItemsService {
  public async execute(): Promise<Item[]> {
    const items = await PostgresSource.getRepository(Item).find();
    return items;
  }
}
