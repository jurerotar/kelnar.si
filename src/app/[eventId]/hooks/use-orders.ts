import { useQueryClient } from '@tanstack/react-query';
import { useEvent } from 'app/hooks/use-event';
import { Order } from 'interfaces/models/order';

export const useOrders = () => {
  const { eventSlug } = useEvent();
  const queryClient = useQueryClient();

  const orders: Order[] = queryClient.getQueryData<Order[]>(['orders', eventSlug])!;

  return {
    orders,
  };
};
