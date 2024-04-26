import { useQueryClient } from '@tanstack/react-query';

export const useStaffMemberName = () => {
  const queryClient = useQueryClient();

  const staffMemberName = queryClient.getQueryData<string | null>(['staff-member-name']) ?? null;

  const setStaffMemberName = (name: string) => {
    queryClient.setQueryData<string>(['staff-member-name'], name);
  };

  console.log(staffMemberName);

  return {
    staffMemberName,
    setStaffMemberName,
  };
};
