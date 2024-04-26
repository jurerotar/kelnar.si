import { LoaderFunction } from 'react-router-dom';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Event } from 'interfaces/models/event';
import { Table } from 'interfaces/models/table';
import { Product } from 'interfaces/models/product';
import { Order } from 'interfaces/models/order';

class MissingTokenError extends Error {
  constructor() {
    super();
    this.name = 'MissingTokenError';
  }
}

class MissingEventError extends Error {
  constructor() {
    super();
    this.name = 'MissingEventError';
  }
}

class EventNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'EventNotFoundError';
  }
}

class InvalidTokenError extends Error {
  constructor() {
    super();
    this.name = 'InvalidTokenError';
  }
}

type EventLoaderParams = Record<'eventSlug', string>;

export const eventLoader: LoaderFunction<EventLoaderParams> = async ({ params, request }) => {
  const { eventSlug } = params as EventLoaderParams;
  const token = new URL(request.url).searchParams.get('token');

  const queryClient = new QueryClient();

  if (!eventSlug) {
    throw new MissingEventError();
  }

  if (!token) {
    throw new MissingTokenError();
  }

  const searchParams = new URLSearchParams({ token });

  const response = await fetch(`${import.meta.env.VITE_API_URI}/events/${eventSlug}?${searchParams.toString()}`);

  if (response.status === 404) {
    throw new EventNotFoundError();
  }

  if (response.status === 401) {
    throw new InvalidTokenError();
  }

  const event: Event = await response.json();

  const staffMemberName = localStorage.getItem(eventSlug);

  queryClient.setQueryData<Event>(['event', eventSlug], event);
  queryClient.setQueryData<Table[]>(['tables', eventSlug], event.tables);
  queryClient.setQueryData<Order[]>(
    ['orders', eventSlug],
    event.tables.flatMap((table) => table.orders)
  );
  queryClient.setQueryData<Product[]>(['products', eventSlug], event.products);
  queryClient.setQueryData<string | null>(['staff-member-name'], staffMemberName);

  return {
    dehydratedState: dehydrate(queryClient),
  };
};
