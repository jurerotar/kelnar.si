import { useQueryClient } from '@tanstack/react-query';

export const useEditMode = () => {
  const queryClient = useQueryClient();

  const isEditModeEnabled = queryClient.getQueryData<boolean>(['edit-mode']) ?? false;

  const toggleEditMode = () => {
    queryClient.setQueryData<boolean>(['edit-mode'], (prev) => !prev);
  };

  return {
    isEditModeEnabled,
    toggleEditMode,
  };
};
