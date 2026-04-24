import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IGetTimesheetsParams, IGetTimesheetsResponse } from '../timesheet.interface';

export function useGetTimesheets(params: IGetTimesheetsParams = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['TIMESHEETS', params],
    queryFn: () => Http.get<IGetTimesheetsResponse>('/timesheets', { params }).then((r) => r.data),
  });

  const invalidateTimesheets = () => {
    queryClient.invalidateQueries({ queryKey: ['TIMESHEETS'] });
  };

  return { ...query, invalidateTimesheets };
}
