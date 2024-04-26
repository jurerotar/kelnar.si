import { Order } from 'interfaces/models/order';

export type Product = {
  id: string;
  name: string;
  price: number;
  orderId: Order['id'];
};
