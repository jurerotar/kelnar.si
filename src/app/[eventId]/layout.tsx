import React, { FCWithChildren, Suspense, useEffect } from 'react';
import { Await, Outlet, useRouteLoaderData } from 'react-router-dom';
import { EventPageSkeleton } from 'app/[eventId]/skeleton';
import { DehydratedState, hydrate, useQueryClient } from '@tanstack/react-query';
import { useEvent } from 'app/hooks/use-event';
import { IconType } from 'react-icons';
import { IoBeer } from 'react-icons/io5';
import { TbBellRinging } from 'react-icons/tb';
import { useProducts } from 'app/[eventId]/hooks/use-products';
import { Product } from 'interfaces/models/product';
import { useEditMode } from 'app/[eventId]/hooks/use-edit-mode';
import { Toggle } from 'app/components/toggle';
import { useOrders } from 'app/[eventId]/hooks/use-orders';
import { Order } from 'interfaces/models/order';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouteSegments } from 'app/[eventId]/hooks/use-route-segments';
import { Modal } from 'app/components/modal';
import { useStaffMemberName } from 'app/[eventId]/hooks/use-staff-member-name';
import { useForm } from 'react-hook-form';

dayjs.extend(relativeTime);

type RouteLoaderData = {
  dehydratedState: DehydratedState;
};

const EventTitle = () => {
  const { event } = useEvent();

  return <span className="font-medium text-white">{event.name}</span>;
};

const EditModeToggle = () => {
  const { isEditModeEnabled, toggleEditMode } = useEditMode();

  return (
    <Toggle
      checked={isEditModeEnabled}
      id="edit-mode"
      onChange={toggleEditMode}
    />
  );
};

type SidebarSectionTitleProps = {
  Icon: IconType;
};

const SidebarSectionTitle: FCWithChildren<SidebarSectionTitleProps> = ({ Icon, children }) => {
  return (
    <span className="inline-flex items-center gap-2 text-gray-200">
      <Icon className="size-7" />
      <span className="text-lg font-medium">{children}</span>
    </span>
  );
};

const Products = () => {
  const { products, productsByOrderAmount } = useProducts();

  if (products.length === 0) {
    return <span className="text-sm text-gray-200">There&apos;s no products yet.</span>;
  }

  return (
    <ul>
      {products.map((product: Product) => (
        <li
          className="mt-1 flex items-center justify-between"
          key={product.id}
        >
          <span className="max-w-[85%] truncate text-sm text-gray-200">{product.name}</span>
          {productsByOrderAmount[product.id] > 0 && (
            <span className="flex size-7 items-center justify-center rounded-full bg-red-500 p-1 text-xs font-medium text-white">
              {productsByOrderAmount[product.id]}
            </span>
          )}
        </li>
      ))}
      <li className="mt-4 flex justify-center">
        <button className="mt-1 flex items-center justify-between rounded-md bg-blue-600 px-3 py-2 text-sm text-gray-200">
          Add new product
        </button>
      </li>
    </ul>
  );
};

const Orders = () => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return <span className="text-sm text-gray-200">Everything seems quiet... for now.</span>;
  }

  return (
    <ul className="scrollbar-hidden max-h-[400px] overflow-y-scroll">
      {orders.map((order: Order) => (
        <li
          className="mt-1 flex items-center justify-between"
          key={order.id}
        >
          <div className="flex w-full flex-col gap-1 rounded-md bg-[#181A22] p-1">
            <span className="text-xs font-medium text-white">
              {dayjs(order.createdAt).fromNow()}, table {order.tableId}
            </span>
            {order.products.map((product: Product) => (
              <span
                className="text-sm text-gray-200"
                key={product.id}
              >
                1x {product.name}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

type NameForm = {
  name: string;
};

export const EventLayout: React.FC = () => {
  const { eventSlug } = useRouteSegments();
  const { dehydratedState } = useRouteLoaderData('event') as RouteLoaderData;
  const appQueryClient = useQueryClient();
  const { staffMemberName } = useStaffMemberName();

  hydrate(appQueryClient, dehydratedState);

  const {
    register: registerNameForm,
    handleSubmit: handleNameForm,
    watch,
  } = useForm<NameForm>({
    defaultValues: {
      name: '',
    },
  });

  const onNameSubmit = ({ name }: NameForm) => {
    appQueryClient.setQueryData<string>(['staff-member-name'], name);
    localStorage.setItem(eventSlug, name);
  };

  useEffect(() => {
    window.Echo.channel(`event.${eventSlug}.tables`)
      .listen('TableCreated', (args) => {
        console.log('TableCreated', args);
      })
      .listen('TableDeleted', (args) => {
        console.log('TableDeleted', args);
      });

    window.Echo.channel(`event.${eventSlug}.orders`)
      .listen('OrderCreated', (args) => {
        console.log('OrderCreated', args);
      })
      .listen('OrderDeleted', (args) => {
        console.log('OrderDeleted', args);
      });

    window.Echo.channel(`event.${eventSlug}.products`)
      .listen('ProductCreated', (args) => {
        console.log('ProductCreated', args);
      })
      .listen('ProductDeleted', (args) => {
        console.log('ProductDeleted', args);
      });

    return () => {
      window.Echo.leaveChannel(`event.${eventSlug}.tables`);
      window.Echo.leaveChannel(`event.${eventSlug}.orders`);
      window.Echo.leaveChannel(`event.${eventSlug}.products`);
    };
  }, []);

  return (
    <Suspense fallback={<EventPageSkeleton />}>
      <Await resolve={!!dehydratedState}>
        <Modal
          isOpen={!staffMemberName}
          closeHandler={() => {}}
        >
          <div className="flex flex-col gap-4">
            <h2>Set your name. Your name will be visible on new orders.</h2>
            <form onSubmit={handleNameForm(onNameSubmit)}>
              <input {...registerNameForm('name')} />
              <button
                type="submit"
                disabled={watch('name').length === 0}
              >
                Create
              </button>
            </form>
          </div>
        </Modal>
        <header className="flex h-16 w-full justify-between border-b border-b-gray-600 bg-[#1F1F1F] p-2">
          <div className="flex items-center">
            <EventTitle />
          </div>

          <div className="">
            <EditModeToggle />
          </div>
        </header>
        <div className="scrollbar-hidden fixed left-0 top-16 z-10 h-[calc(100vw-4rem)] w-80 overflow-y-scroll border-r border-r-gray-600 bg-[#1F1F1F]">
          <ul className="flex flex-col gap-4 px-2 py-4">
            <li className="flex flex-col gap-2">
              <SidebarSectionTitle Icon={TbBellRinging}>Orders</SidebarSectionTitle>
              <Orders />
            </li>
            <li className="flex flex-col gap-2">
              <SidebarSectionTitle Icon={IoBeer}>Products</SidebarSectionTitle>
              <Products />
            </li>
          </ul>
        </div>
        <div className="ml-80">
          <Outlet />
        </div>
      </Await>
    </Suspense>
  );
};
