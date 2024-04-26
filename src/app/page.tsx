import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Event } from 'interfaces/models/event';
import { useFetch } from 'app/hooks/use-fetch';

type ExistingEventForm = {
  slug: string;
  token: string;
};

type NewEventForm = {
  name: string;
};

type CreateEventArgs = {
  name: string;
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { fetchFn } = useFetch();

  const { mutateAsync: createEvent } = useMutation<Event, Error, CreateEventArgs>({
    mutationFn: async ({ name }) => {
      return fetchFn('/events', {
        method: 'POST',
        body: JSON.stringify({
          name,
        }),
      });
    },
  });

  const { register: registerExistingEventForm, handleSubmit: handleExistingEventForm } = useForm<ExistingEventForm>({
    defaultValues: {
      slug: '',
      token: '',
    },
  });

  const { register: registerNewEventForm, handleSubmit: handleNewEventForm } = useForm<NewEventForm>({
    defaultValues: {
      name: '',
    },
  });

  const onExistingEventFormSubmit = ({ slug, token }: ExistingEventForm) => {
    const searchParams = new URLSearchParams({ token });

    navigate({ pathname: `/events/${slug}`, search: searchParams.toString() });
  };

  const onNewEventFormSubmit = async ({ name }: NewEventForm) => {
    const { token, slug } = await createEvent({ name });

    const searchParams = new URLSearchParams({ token });

    navigate({ pathname: `/events/${slug}`, search: searchParams.toString() });
  };

  return (
    <>
      Home page
      <form onSubmit={handleNewEventForm(onNewEventFormSubmit)}>
        <input {...registerNewEventForm('name')} />
        <button type="submit">Create</button>
      </form>
      <form onSubmit={handleExistingEventForm(onExistingEventFormSubmit)}>
        <input {...registerExistingEventForm('slug')} />
        <input {...registerExistingEventForm('token')} />
        <button type="submit">Enter</button>
      </form>
    </>
  );
};
