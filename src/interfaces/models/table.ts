import { Order } from 'interfaces/models/order';
import { Event } from 'interfaces/models/event';

export type Table = {
  eventId: Event['id'];
  id: string;
  row: number;
  column: number;
  orientation: 'x' | 'y';
  type: 'bar' | 'table';
  orders: Order[];
};
