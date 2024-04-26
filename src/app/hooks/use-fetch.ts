import { useSearchParams } from 'react-router-dom';
import { useRouteSegments } from 'app/[eventId]/hooks/use-route-segments';

export const useFetch = () => {
  const { eventSlug } = useRouteSegments();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const fetchFn = async (url: RequestInfo | URL, requestInit?: RequestInit) => {
    const response = await fetch(`${import.meta.env.VITE_API_URI}${url}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(requestInit?.headers ?? {}),
      },
      ...requestInit,
    });

    const responseData = await response.json();
    return responseData;
  };

  const eventFetchFn = async (url: RequestInfo | URL, requestInit?: RequestInit) => {
    return fetchFn(`/events/${eventSlug}${url}?${new URLSearchParams({ token }).toString()}`, requestInit);
  };

  return {
    fetchFn,
    eventFetchFn,
  };
};
