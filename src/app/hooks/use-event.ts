import { useQueryClient } from '@tanstack/react-query';
import { useRouteSegments } from 'app/[eventId]/hooks/use-route-segments';
import { Event } from 'interfaces/models/event';

export const useEvent = () => {
  const { eventSlug } = useRouteSegments();
  const queryClient = useQueryClient();

  const event = queryClient.getQueryData<Event>(['event', eventSlug])!;

  return {
    event,
    eventSlug,
  };
};
