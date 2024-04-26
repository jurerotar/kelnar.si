import { useRouteError } from 'react-router-dom';

export const EventPageErrorBoundary = () => {
  const error = useRouteError();
  const { name, message } = error as Error;

  return (
    <>
      <p>{name}</p>
      <p>{message}</p>
    </>
  );
};
