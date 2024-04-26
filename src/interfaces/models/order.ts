import { Table } from 'interfaces/models/table';
import { Product } from 'interfaces/models/product';

export type Order = {
  id: string;
  tableId: Table['id'];
  products: Product[];
  updatedAt: string;
  createdAt: string;
};
