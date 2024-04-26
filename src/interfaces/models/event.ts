import { Table } from 'interfaces/models/table';
import { Product } from 'interfaces/models/product';

export type Event = {
  id: string;
  name: string;
  slug: string;
  token: string;
  tables: Table[];
  products: Product[];
};
