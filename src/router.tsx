import React, { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { eventLoader } from 'app/[eventId]/loader';

const Layout = lazy(async () => ({ default: (await import('app/layout')).Layout }));
const HomePage = lazy(async () => ({ default: (await import('app/page')).HomePage }));
const EventLayout = lazy(async () => ({ default: (await import('app/[eventId]/layout')).EventLayout }));
const EventPageErrorBoundary = lazy(async () => ({ default: (await import('app/[eventId]/error-boundary')).EventPageErrorBoundary }));
const EventPage = lazy(async () => ({ default: (await import('app/[eventId]/page')).EventPage }));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route
          index
          element={<HomePage />}
        />
      </Route>
      <Route
        id="event"
        path="events/:eventSlug"
        element={<EventLayout />}
        loader={eventLoader}
        errorElement={<EventPageErrorBoundary />}
      >
        <Route
          index
          element={<EventPage />}
        />
        <Route
          index
          element={<EventPage />}
        />
      </Route>
    </Route>
  )
);
