import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { AxiosResponseError } from '@/config/http';
import type { ISupervisor } from '@/interfaces';
import { SUPERVISORS_QUERY_KEY } from '@/query-keys';

export function useGetSupervisors() {
  return useQuery<ISupervisor[], AxiosResponseError>({
    queryKey: SUPERVISORS_QUERY_KEY,
    queryFn: () =>
      Http.get<ISupervisor[]>('/users', { params: { role: 'supervisor' } }).then(
        ({ data }) => data,
      ),
  });
}
