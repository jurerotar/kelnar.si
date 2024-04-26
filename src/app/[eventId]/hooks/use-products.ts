import { useQueryClient } from '@tanstack/react-query';
import { useEvent } from 'app/hooks/use-event';
import { Product } from 'interfaces/models/product';
import { useOrders } from 'app/[eventId]/hooks/use-orders';
import { Order } from 'interfaces/models/order';

export const useProducts = () => {
  const { eventSlug } = useEvent();
  const queryClient = useQueryClient();
  const { orders } = useOrders();

  const products: Product[] = queryClient.getQueryData<Product[]>(['products', eventSlug])!;
  const productsByOrderAmount: Record<Product['id'], number> = Object.fromEntries(
    products.map(({ id }) => {
      const productsInOrders = orders.flatMap((order: Order) => order.products);
      const amount = productsInOrders.filter(({ id: productId }) => id === productId).length;
      return [id, amount];
    })
  );

  return {
    products,
    productsByOrderAmount,
  };
};
