import { useQueryClient } from '@tanstack/react-query';
import { useEvent } from 'app/hooks/use-event';
import { Table } from 'interfaces/models/table';

export const useTables = () => {
  const { eventSlug } = useEvent();
  const queryClient = useQueryClient();

  const tables: Table[] = queryClient.getQueryData<Table[]>(['tables', eventSlug])!;

  return {
    tables,
  };
};
