import { useParams } from 'react-router-dom';

export const useRouteSegments = () => {
  const { eventSlug } = useParams();

  return {
    eventSlug: eventSlug as string,
  };
};
